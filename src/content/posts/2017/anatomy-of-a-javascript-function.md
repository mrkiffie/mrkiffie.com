---
title: "Anatomy of a JavaScript function"
date: 2017-08-28 22:43:51 +02:00
category: "code"
layout: blog-post.hbs
styles:
    - "prism.css"
    - "fancy-quotes.css"
---

The name "function" comes from Mathematics. It is used to calculate a value based on input.

![f(x) = x + 3
if x = 2 then
f(2) = 2 + 3 = 5](/assets/img/f-of-x.svg)

In computing, a function is a sequence of instructions within a larger computer program.

[Pascal](https://en.wikipedia.org/wiki/Pascal_%28programming_language%29#Procedures_and_functions) has the keywords `procedure` and `function`. The distinction being that a `function` always return a value while `procedure` just executes commands.

In object-oriented languages, a `function` that is part of a `class` is often referred to as a "method"

## The function returns!

Sort of sounds like the sequal to some epic Javascript drama.

In JavaScript, a function _always_ returns a value. The default return value of a function is `undefined`.

```js
function sayHi() {
    console.log("Hi!!!");
}
sayHi();
// "Hi!!!"
// undefined
```

The return statement ends function execution and specifies a value to be returned to the function caller.

```js
function countSheep() {
    console.log(1);
    console.log(2);
    console.log(3);
    return "ZZZzzzzz...";
    // we never reach this point
    console.log(4);
    console.log(5);
}
countSheep();
// 1
// 2
// 3
// "ZZZzzzzz..."
```

## The function signature

A function can have 0, 1 or many _parameters_. The order of these paramaters determine the function's _signature_. The number of paramaters is called _arity_.

```js
function (/* This is where the params go */) {
}
```

## The function body

Following the signature is the _function body_. The function body contains the sequence of instructions to be performed composed of _statements_ and _expressions_.

```js
function () {
    // The start of the function body
    statement;
    statement;
    return expression;
    // The end of the function body
}
```

> JavaScript distinguishes _expressions_ and _statements_. An expression produces a value and can be written wherever a value is expected, for example as an argument in a function call.

For more on this distinction, give Dr. Axel Rauschmayer's [Expressions versus Statements in JavaScript](http://2ality.com/2012/09/expressions-vs-statements.html) a read.

## Function Declaration

The function declaration defines a `function` with the specified parameters.

```js
function fn1(param1, param2, paramN) {
    // statements
}
```

## Function Expression

The `function` keyword can be used to define a function inside an expression. These can be either "named" or "anonymous" function.

### Named function expression

This function has the name "Bob". Bob is used in an assignment expression. This combination is known as a "named function expression"

```js
const fn2 = function Bob(param1, param2, paramN) {
    // statements
};
```

### Anonymous function expression

This function does not have a name (aka anonymous). This anonymous function is used in an assigned expression. This combination is called an "anonymous function expression"

```js
const fn3 = function (param1, param2, paramN) {
    // statements
};
```

I'm sure this is gonna blow someone's mind...

## Some points about arrow functions

-   Arrow functions have a shorter syntax than a regular function.

```js
const foo = (x) => x * x;
// vs
const bar = function (x) {
    return x * x;
};
```

-   Arrow functions are always used as _expressions_.

```js
Promise.resolve().then(() => {
    console.log("defined inline as an expression");
});
```

-   An arrow function expression does not bind its own `this`, `arguments`, `super`, or `new.target`. These function expressions are best suited for non-method functions, and they cannot be used as constructors. Not having it's own context is very useful.

```js
function greetMeLater() {
    setTimeout(() => console.log(`Hello ${this.name}`), 1000);
}
greetMeLater.call({ name: "Alice" });
```

-   Multiple _statements_ need to be enclosed in brackets.

```js
const fn4 = () => {
    const words = [];
    words.push("Over");
    words.push("Engineered");
    words.push(String.fromCodePoint(128169));
    return words.join(" ");
};
```

-   A single _expression_ requires no brackets. The expression is also the implicit return value of the function.

```js
[1, 2, 3].map((x) => x * x);
// [1, 4, 9]

const done = () => "And thats about it for now... Cheers";
done();
// "And thats about it for now... Cheers"
```
