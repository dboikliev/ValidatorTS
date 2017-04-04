import "reflect-metadata";

let validatorKey = Symbol("validator");

interface IValidator {
    validate: (obj) => boolean;
    message: string,
    property: string
}

export function required(message: string) {
    return defineValidator(property => !!property, message);
}

export function range(min: number, max: number, message: string) {
    return defineValidator(
        property => property >= min && property <= max, 
        message
    );
}

export function length(min: number, max: number, message: string) {
    return defineValidator(
        property => property && property.length >= min && property.length <= max,
        message
    );
}

function defineValidator(vadalidatorPredicate: (obj) => boolean, message: string) {
    return function (target: any, propertyKey: string | symbol) {
        let symbol = Symbol();
        Reflect.defineMetadata(symbol, { 
            [validatorKey]: {
                validate: (obj) => vadalidatorPredicate(obj[propertyKey]),
                message: message,
                property: propertyKey
            }
        }, target);
    };
}

export function validate(target): {} {
    let result = Reflect.getMetadataKeys(target)
        .map(key => Reflect.getMetadata(key, target))
        .filter(metadata => metadata[validatorKey] && !metadata[validatorKey].validate(target))
        .map(metadata => ({ property: metadata[validatorKey].property, message: metadata[validatorKey].message }));
    
    return result;
};