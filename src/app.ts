import {
    required,
    range,
    length,
    regex,
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
    @regex(/1+/, "Data must be a string of 1s")
    data = "a";

}

console.log(validate(new Person()));

