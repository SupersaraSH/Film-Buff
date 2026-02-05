const {z} = require("zod");

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/

const registerSchema = z.object({
  user_name: z.string()
              .min(3, {message: "The name must be longer than 3 characters"})
              .max(40, {message: "The name must be less than 40 characters"}),
  
  last_name: z.string()
              .min(3, {message: "The last name must be longer than 3 characters"})
              .max(60, {message: "The last name must be less than 60 characters"}),

  email:z.string()
           .email({message: "Invalid email format"}),

  description: z.string()
              .max(300, {message: "The name must be less than 300 characters"}),

  password: z.string()
               .regex(passwordRegEx, {message: `The password must be at least 6 
                characters long, with a number, an uppercase letter, a lowercase 
                letter, and a special character.`}),
  
  repPassword: z.string(),

  file: z.object({
            mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png'],
            {message: "File not allowed"}),
            size: z.number().max(1*1024*1024, 
            {message: "Image too large"})
            })
           .optional()

}).refine((data)=> data.password === data.repPassword , 
          {
            message: "Passwords must match",
            path: ["repPassword"]
          });

module.exports = registerSchema;

//Tipos básicos
//z.string()
//z.number()
//z.boolean()
//z.bigint()
//z.date()
//z.undefined()
//z.null()
//z.void()
//z.any()
//z.unknown()
//z.never()

//Strings (los más usados)
//z.string()
//  .min(3)
//  .max(50)
//  .length(10)
//  .email()
//  .url()
//  .uuid()
//  .regex(/^[0-9]+$/)
//  .startsWith("A")
//  .endsWith(".com")
//  .trim()
//  .toLowerCase()
//  .toUpperCase()

//Números
//z.number()
//  .min(0)
//  .max(100)
//  .int()
//  .positive()
//  .negative()
//  .nonnegative()
//  .nonpositive()
//  .multipleOf(5)

//String → número
//z.coerce.number()