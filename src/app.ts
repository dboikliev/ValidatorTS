import {
    required,
    range,
    length,
    regex,
    validate,
    compare,
    validated
} from "./validator";

type Gender = "male" | "female" | "unknown";

class Human {
    @required("sex is required.")
    gender: Gender;
}

class Person extends Human {
    @required("name is required.")
    name: string;
    @range(1, 10, "age must be in the range [1, 10].")
    age: number;
    @required("data is required.")
    @length(10, 10, "data must be of length 10.")
    @regex(/1+/, "data must be a string of 1s.")
    data;

    @required("password is required.")
    password = "1";

    @compare("password", "both passwords must be the same.")
    passwordRepeat;
}

console.log(validate(new Person()));
