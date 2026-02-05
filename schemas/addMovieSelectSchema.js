const {z} = require("zod");

const ratingRegEx = /^[1-5]$/
const yearRegEx = /^(18\d{2}|19\d{2}|20\d{2}|21\d{2}|2200)$/

const addMovieSelectSchema = z.object({
  user_id:z.string({
    required_error: "You must select a user"
  })
          .min(0, { message: "You must select a user" }),

  title: z.string()
          .min(3, {message: "The title must be longer than 3 characters"})
          .max(40, {message: "The title must be less than 40 characters"}),
  
  review: z.string()
           .max(300, {message: "The name must be less than 300 characters"}),

  rating: z.string()
           .regex(ratingRegEx, { message: "The number must be between 1 and 5" }),

  format: z.string()
              .min(3, {message: "The format must be longer than 3 characters"})
              .max(30, {message: "The format must be less than 40 characters"}),

  release_year: z.string()
           .regex(yearRegEx, { message: "The number must be a year" }),

  file: z.object({
            mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png'],
            {message: "File not allowed"}),
            size: z.number().max(1*1024*1024, 
            {message: "Image too large"})
            })
           .optional()

});

module.exports = addMovieSelectSchema;