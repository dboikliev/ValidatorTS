import "reflect-metadata";

let validations = {};
let typeDecorators = new Map();


export function required(message: string) {
    return defineValidator(property => !!property, message);
}

export function range(min: number, max: number, message: string) {
    return function (target: any, propertyKey: string | symbol) {
        let symbol = Symbol();
        Reflect.defineMetadata(symbol, {
            validate: (obj) => {
                return obj[propertyKey] >= min && obj[propertyKey] <= max;
            },
            message: message
        }, target);
    };
}

export function length(min: number, max: number, message: string) {
    return defineValidator(property => property && property.length && property.length >= min && property.length <= max, message);
}

function defineValidator(vadalidator: (obj) => boolean, message: string) {
    return function (target: any, propertyKey: string | symbol) {
        let symbol = Symbol();
        Reflect.defineMetadata(symbol, {
            validate: (obj) => vadalidator(obj[propertyKey]),
            message: message
        }, target);
    };
}

export function validate(target): {} {
    let result = [];
    Reflect.getMetadataKeys(target).forEach(key => {
        let validator = Reflect.getMetadata(key, target);
        if (!validator.validate(target)) {
            result.push(validator.message);
        }
    });
    return result;
};