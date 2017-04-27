import "reflect-metadata";

let validatorKey = Symbol("validator");

interface IValidator {
    validate: (obj) => boolean;
    message: string;
    property: string;
}

export function required(message: string) {
    return defineValidator(
        (obj, propertyKey) => Reflect.has(obj, propertyKey), 
        message);
}

export function compare(propertyName: string, message: string) {
    return defineValidator(
        (obj, propertyKey) => obj[propertyName] === obj[propertyKey], 
        message);
}

export function range(min: number, max: number, message: string) {
    return defineValidator(
        (obj, propertyKey) => obj[propertyKey] >= min && obj[propertyKey] <= max,
        message
    );
}

export function length(min: number, max: number, message: string) {
    return defineValidator(
        (obj, propertyKey) => obj[propertyKey] && obj[propertyKey].length >= min && obj[propertyKey].length <= max,
        message
    );
}

export function regex(expression: RegExp, message: string) {
    return defineValidator(
        (obj, propertyKey) => typeof obj[propertyKey] == "string" && expression.test(obj[propertyKey] as string), 
        message);
}

function defineValidator(vadalidatorPredicate: (obj: Object, propertyKey: string | symbol) => boolean, message: string) {
    return function (target: any, propertyKey: string | symbol) {
        let symbol = Symbol();
        Reflect.defineMetadata(symbol, {
            [validatorKey]: {
                validate: (obj) => vadalidatorPredicate(obj, propertyKey),
                message: message,
                property: propertyKey
            }
        }, target);
    };
}

export function validate(target): {} {
    if (typeof target === "object") {
        let result = Reflect.getMetadataKeys(target)
            .map(key => Reflect.getMetadata(key, target))
            .filter(metadata => metadata[validatorKey] && !metadata[validatorKey].validate(target))
            .map(metadata => ({ property: metadata[validatorKey].property, message: metadata[validatorKey].message }));

        return result;
    }

    return [];
};

export function validated(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    let original: Function = descriptor.value;
    descriptor.value = function (...args: any[]) {
        let modelState = args.map(arg => validate(arg));
        args.push(modelState);
        original.apply(this, args);
    };
    return descriptor;
}