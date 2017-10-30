import "reflect-metadata";

let validatorKey = Symbol("validator");

interface IValidator<T> {
    validate: (obj: T) => boolean;
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
        (obj, propertyKey) => obj[propertyKey] && 
                              obj[propertyKey].length >= min && 
                              obj[propertyKey].length <= max,
        message
    );
}

export function regex(expression: RegExp, message: string) {
    return defineValidator(
        (obj, propertyKey) => typeof obj[propertyKey] == "string" && 
                              expression.test(obj[propertyKey]), 
        message);
}

export function defineValidator(validatorPredicate: (obj: Object, propertyKey: string | symbol) => boolean, message: string)
    : (target: any, propertyKey: string | symbol) => void {
    return function (target: any, propertyKey: string | symbol) {
        let symbol = Symbol();
        Reflect.defineMetadata(symbol, {
            [validatorKey]: {
                validate: (obj) => validatorPredicate(obj, propertyKey),
                message: message,
                property: propertyKey
            }
        }, target);
    };
}

export function validate<T>(target: T): { [key: string]: string }[] {
    if (typeof target === "object") {
        let result = Reflect.getMetadataKeys(target)
            .map(key => Reflect.getMetadata(key, target))
            .map(metadata => metadata[validatorKey] as IValidator<T>)
            .filter(metadata => metadata && !metadata.validate(target))
            .map(metadata => ({ property: metadata.property, message: metadata.message }));

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