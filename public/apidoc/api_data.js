define({ "api": [  {    "type": "post",    "url": "/v1/auth/login",    "title": "Login",    "name": "Login",    "group": "Auth",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": ""          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "accessToken",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "src/apiV1/auth/controller.ts",    "groupTitle": "Auth"  },  {    "type": "post",    "url": "/v1/auth/register",    "title": "Register",    "name": "Register",    "group": "Auth",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "firstName",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "lastName",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": ""          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "accessToken",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "src/apiV1/auth/controller.ts",    "groupTitle": "Auth"  },  {    "type": "post",    "url": "/v1/offer/create",    "title": "Create new offer",    "name": "Create",    "group": "Offer",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Bearer token</p>"          }        ]      }    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "maxPeriod",            "description": "<p>(months) min: 1</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "risk",            "description": "<p>min: 1, max: 5</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "rate",            "description": "<p>min: 1</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/apiV1/offer/controller.ts",    "groupTitle": "Offer"  },  {    "type": "post",    "url": "/v1/offer/update",    "title": "Update the offer",    "name": "Update",    "group": "Offer",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Bearer token</p>"          }        ]      }    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "maxPeriod",            "description": "<p>(months) min: 1</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "risk",            "description": "<p>min: 1, max: 5</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "rate",            "description": "<p>min: 1</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/apiV1/offer/controller.ts",    "groupTitle": "Offer"  },  {    "type": "post",    "url": "/v1/user/top-up",    "title": "Top Up",    "name": "TopUp",    "group": "User",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Bearer token</p>"          }        ]      }    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "amount",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "src/apiV1/user/controller.ts",    "groupTitle": "User"  },  {    "type": "post",    "url": "/v1/user/update",    "title": "Update user info",    "name": "Update",    "group": "User",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Bearer token</p>"          }        ]      }    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "firstName",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "lastName",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "birthDate",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "country",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "employmentIndustry",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "incomeBracket",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "src/apiV1/user/controller.ts",    "groupTitle": "User"  }] });
