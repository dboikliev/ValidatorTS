import {
    required,
    range,
    length,
    validate
} from "./validator";

class Human {
    @required("Sex is required.")
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
}

let person1 = new Person();
let person2 = new Human();

let person3 = new Person();
person3.age = 5;


// console.log(validate(new Test()));
// // console.log(validate(person1));
console.log(validate(person1));
console.log();
console.log(validate(person2));
console.log();
console.log(validate(person3));


