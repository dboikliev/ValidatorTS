import "reflect-metadata";

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

function defineValidator(vadalidator: (obj) => boolean, message: string) {
    return function (target: any, propertyKey: string | symbol) {
        let symbol = Symbol();
        Reflect.defineMetadata(symbol, {
            validate: (obj) => vadalidator(obj[propertyKey]),
            message: message,
            property: propertyKey
        }, target);
    };
}

export function validate(target): {} {
    let result = [];

    Reflect.getMetadataKeys(target).forEach(key => {
        let validator = Reflect.getMetadata(key, target);
        let validation = validator.validate && !validator.validate(target);
        if (validation) {
            result.push({
                property: validator.property,
                message: validator.message
            });
        }
    });
    
    return result;
};