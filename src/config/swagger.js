const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:3500',
        description: 'Development server'
      },
      {
        url: 'https://api.petclinic.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token'
        }
      },
      schemas: {
        Pet: {
          type: 'object',
          required: ['customerId', 'clinicId', 'staffId', 'speciesId', 'name', 'coatColor', 'dateOfBirth', 'gender'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the pet',
              example: '64a7b5c8d1234567890abcde'
            },
            customerId: {
              type: 'string',
              description: 'ID of the customer who owns the pet',
              example: '64a7b5c8d1234567890abcdf'
            },
            clinicId: {
              type: 'string',
              description: 'ID of the clinic where the pet is registered',
              example: '64a7b5c8d1234567890abce0'
            },
            staffId: {
              type: 'string',
              description: 'ID of the staff member assigned to the pet',
              example: '64a7b5c8d1234567890abce1'
            },
            speciesId: {
              type: 'string',
              description: 'ID of the species of the pet',
              example: '64a7b5c8d1234567890abce2'
            },
            name: {
              type: 'string',
              description: 'Name of the pet',
              example: 'Buddy'
            },
            coatColor: {
              type: 'string',
              description: 'Color of the pet\'s coat',
              example: 'Golden'
            },
            dateOfBirth: {
              type: 'string',
              description: 'Date of birth of the pet',
              example: '2020-05-15'
            },
            gender: {
              type: 'string',
              description: 'Gender of the pet',
              enum: ['Male', 'Female'],
              example: 'Male'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the pet was created',
              example: '2023-07-07T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the pet was last updated',
              example: '2023-07-07T10:30:00Z'
            }
          }
        },
        Clinic: {
          type: 'object',
          required: ['name', 'province', 'city', 'streetAddress', 'email', 'phoneNumber', 'website'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the clinic',
              example: '64a7b5c8d1234567890abcde'
            },
            name: {
              type: 'string',
              description: 'Name of the clinic',
              example: 'Happy Pets Veterinary Clinic'
            },
            province: {
              type: 'string',
              description: 'Province where the clinic is located',
              example: 'Ho Chi Minh'
            },
            city: {
              type: 'string',
              description: 'City where the clinic is located',
              example: 'Ho Chi Minh City'
            },
            streetAddress: {
              type: 'string',
              description: 'Street address of the clinic',
              example: '123 Nguyen Hue Street, District 1'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the clinic',
              example: 'contact@happypets.com'
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the clinic',
              example: '+84-28-1234-5678'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Website URL of the clinic',
              example: 'https://www.happypets.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the clinic was created',
              example: '2023-07-07T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the clinic was last updated',
              example: '2023-07-07T10:30:00Z'
            }
          }
        },
        PetCreateRequest: {
          type: 'object',
          required: ['customerId', 'clinicId', 'staffId', 'speciesId', 'name', 'coatColor', 'dateOfBirth', 'gender'],
          properties: {
            customerId: {
              type: 'string',
              description: 'ID of the customer who owns the pet',
              example: '64a7b5c8d1234567890abcdf'
            },
            clinicId: {
              type: 'string',
              description: 'ID of the clinic where the pet is registered',
              example: '64a7b5c8d1234567890abce0'
            },
            staffId: {
              type: 'string',
              description: 'ID of the staff member assigned to the pet',
              example: '64a7b5c8d1234567890abce1'
            },
            speciesId: {
              type: 'string',
              description: 'ID of the species of the pet',
              example: '64a7b5c8d1234567890abce2'
            },
            name: {
              type: 'string',
              description: 'Name of the pet',
              example: 'Buddy'
            },
            coatColor: {
              type: 'string',
              description: 'Color of the pet\'s coat',
              example: 'Golden'
            },
            dateOfBirth: {
              type: 'string',
              description: 'Date of birth of the pet',
              example: '2020-05-15'
            },
            gender: {
              type: 'string',
              description: 'Gender of the pet',
              enum: ['Male', 'Female'],
              example: 'Male'
            }
          }
        },
        ClinicCreateRequest: {
          type: 'object',
          required: ['name', 'province', 'city', 'streetAddress', 'email', 'phoneNumber', 'website'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the clinic',
              example: 'Happy Pets Veterinary Clinic'
            },
            province: {
              type: 'string',
              description: 'Province where the clinic is located',
              example: 'Ho Chi Minh'
            },
            city: {
              type: 'string',
              description: 'City where the clinic is located',
              example: 'Ho Chi Minh City'
            },
            streetAddress: {
              type: 'string',
              description: 'Street address of the clinic',
              example: '123 Nguyen Hue Street, District 1'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the clinic',
              example: 'contact@happypets.com'
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the clinic',
              example: '+84-28-1234-5678'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Website URL of the clinic',
              example: 'https://www.happypets.com'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found'
            },
            error: {
              type: 'string',
              description: 'Detailed error information',
              example: 'The requested resource could not be found'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Forbidden: {
          description: 'Access forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication operations'
      },
      {
        name: 'Users Management',
        description: 'User management operations (Admin only)'
      },
      {
        name: 'Pets',
        description: 'Pet management operations'
      },
      {
        name: 'Clinics',
        description: 'Clinic management operations'
      }
    ]
  },
  apis: ['./src/**/*.js'], // Đường dẫn đến các file chứa JSDoc comments
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerSpec: specs,
  swaggerUi
};
