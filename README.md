# ValidatorTS
A TypeScript validator implementation inspired by C# data annotations like [Required], [Range] etc.

## Example

#### 1. Property decorators

#### Code:
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

#### Result:

```
[ 'name is required.',
  'age must be in the range [1, 10].',
  'data must be of length 10.',
  'data is required',
  'sex is required.' ]
```

#### 2. Method decorator

#### Code:

```typescript
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
```

#### Result: 

When @validated is used on a method, an object containing the validation results for each of the method arguments will be passed as the last argument.
It can be retrieved either by explicitly adding a parameter to the method's signature or by indexing the arguments array.
The indices in the modelState array correspond to the indices of the method's parameters.

```
[ [ { property: 'name', message: 'name is required.' },
    { property: 'age',
      message: 'age must be in the range [1, 10].' },
    { property: 'data', message: 'data must be of length 10.' },
    { property: 'data', message: 'data is required' },
    { property: 'sex', message: 'sex is required.' } ] ]
```