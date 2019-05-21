# NodeJsLab02

Applications to make http calls and seva result in json files

### Installing

Step 1. Clone the repo
```
git clone https://github.com/maxsmith009/NodeJsLab02.git
```

To access Http application use 
```
cd HttpPart
```

To access Express application use 
```
cd ExpressPart
```

Step 2. Install dependencies
```
npm install
```

Step 3. Run server
```
npm start
```

##Interfaces

Employee Interface

```
interface IEmployee {
    id: string,
    firstName: string,
    lastName: string,
    vacationDaysLeft: number
}
```

Vacation Interface

```
interface IVacation {
    id: string,
    employeeId: string,
    startDate: number,
    endDate: number,
    numberOfDays: number
}
```

## HttpPart Api

###Endpoints

Get all employees
```
GET /employees
```
Get employee by id
```
GET /employee?id=<IEmployee.id>
```
Create employee
```
POST /employee
```
{
    "firstName": "string",
    "lastName": "string"
}

Delete employee by id
```
DELETE /employee?id=<IEmployee.id>
```
Update employee by id
```
PUT /employee?id=<IEmployee.id>
```
{
    "firstName": "string",
    "lastName": "string",
    "vacationDaysLeft": number
}

Get all vacations
```
GET /vacations
```
Get vacation by id
```
GET /vacation?id=<IVacaion.id>
```
Create vacation
```
POST /vacation
```
{
    "employeeId":"string"
    "startDate": number (time in milliseconds)
    "numberOfDays": number
}

Delete vacation by id
```
DELETE /vacation?id=<IVacaion.id>
```
Update vacation by id
```
PUT /vacation?id=<IVacaion.id>
```
{
    "employeeId":"string"
    "startDate": number (time in milliseconds)
    "numberOfDays": number
}

Create new vacation
```
POST /new-vacation-request
```
{
    "employeeId":"string"
    "startDate": number (time in milliseconds)
    "numberOfDays": number
}
Get vacations of employee
```
GET /employee-vacations?id=<IEmployee.id>
```
Get employees, who are on vacation in specific day
```
GET /vacations-on-date?date=<time in milliseconds>
```
Get server status
```
GET /health-check
```


## ExpressPart Api

Get all employees
```
GET /employees
```
Get employee by id
```
GET /employees/employee?id=<IEmployee.id>
```
Create employee
```
POST /employees/employee
```
{
    "firstName": "string",
    "lastName": "string"
}

Delete employee by id
```
DELETE /employees/employee?id=<IEmployee.id>
```
Update employee by id
```
PUT /employees/employee?id=<IEmployee.id>
```
{
    "firstName": "string",
    "lastName": "string",
    "vacationDaysLeft": number
}

Get all vacations
```
GET /vacations
```
Get vacation by id
```
GET /vacations/vacation?id=<IVacaion.id>
```
Create vacation
```
POST /vacations/vacation
```
{
    "employeeId":"string"
    "startDate": number (time in milliseconds)
    "numberOfDays": number
}

Delete vacation by id
```
DELETE /vacations/vacation?id=<IVacaion.id>
```
Update vacation by id
```
PUT /vacations/vacation?id=<IVacaion.id>
```
{
    "employeeId":"string"
    "startDate": number (time in milliseconds)
    "numberOfDays": number
}

Create new vacation
```
POST /employees/new-vacation-request
```
{
    "employeeId":"string"
    "startDate": number (time in milliseconds)
    "numberOfDays": number
}
Get vacations of employee
```
GET /vacations/employee-vacations?id=<IEmployee.id>
```
Get employees, who are on vacation in specific day
```
GET /vacations/vacations-on-date?date=<time in milliseconds>
```
Get server status
```
GET /health-check
```
