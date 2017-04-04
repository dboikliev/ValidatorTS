import {
    required,
    range,
    length,
    validate,
    validated
} from "./validator";

class Human {
    @required("sex is required.")
    sex: string;
}

class Person extends Human {
    @required("name is required.")
    name: string;
    @range(1, 10, "age must be in the range [1, 10].")
    age: number;
    @required("data is required")
    @length(10, 10, "data must be of length 10.")
    data;

    @validated
    test(p: Person) {
        let modelState = arguments[arguments.length - 1];
        console.log(modelState);
        return;
    }
}

let p = new Person();
p.test(new Person());
