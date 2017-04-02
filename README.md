# ValidatorTS
A TypeScript validator implementation inspired by C# data annotations like [Required], [Range] etc.

## Example

```typescript
import {
    required,
    range,
    length,
    validate
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
}

let person = new Person();
console.log(validate(person));
```
