const {z} = require("zod");

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/

const loginSchema = z.object({
  
  email:z.string()
           .email({message: "Invalid email format"}),

  password: z.string()
               .regex(passwordRegEx, {message: `The password must be at least 6 
                characters long, with a number, an uppercase letter, a lowercase 
                letter, and a special character.`}),
  
  repPassword: z.string(),

}).refine((data)=> data.password === data.repPassword , 
          {
            message: "Passwords must match",
            path: ["repPassword"]
          });

module.exports = loginSchema;
