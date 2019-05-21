import { ParsedUrlQuery } from "querystring";
import { EmployeeService } from "../services/employee.service";

const uniqid = require('uniqid');
const fs = require('fs');
const EmpService = new EmployeeService();

export interface IEmployee {
    id: string,
    firstName: string,
    lastName: string,
    vacationDaysLeft: number
}


export default class EmployeeController implements IEmployee {

    id: string;
    firstName: string;
    lastName: string;
    vacationDaysLeft: number;

    constructor(props: { id: string; firstName: string; lastName: string; vacationDaysLeft: number; }) {
        this.id = props.id;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.vacationDaysLeft = props.vacationDaysLeft;
    }

    static dispatchEmployee(method: string | SVGAnimatedEnumeration | undefined, query: ParsedUrlQuery, data: any, res: any) {

        switch (method) {
            case 'GET':
                this.getEmployee(query, res);
                break;
            case 'POST':
                this.createEmployee(data, res);
                break;
            case 'DELETE':
                this.deleteEmployee(query, res);
                break;
            case 'PUT':
                this.updateEmployee(query, data, res);
                break;
        }

    }

    static getEmployees(res: any) {
        fs.readFile('./src/store/employees.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;
            res.end(data);
        });
    }

    private static createEmployee(employeeData: any, res: any) {
        fs.readFile('./src/store/employees.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;

            if (employeeData.firstName && employeeData.lastName) {
                let newEmployeeData = JSON.parse(data);

                newEmployeeData.push({
                    id: uniqid(),
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    vacationDaysLeft: 27
                });

                fs.writeFile('./src/store/employees.json', JSON.stringify(newEmployeeData), (err: Error) => {
                    if (err) throw err;
                    res.end(JSON.stringify(newEmployeeData));
                });
            } else {
                res.statusCode = 400;
                res.end("Parameters Error");
            }


        });
    }

    private static getEmployee(query: ParsedUrlQuery, res: any) {
        fs.readFile('./src/store/employees.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;

            if (query.id) {
                let response = JSON.parse(data).filter((el: IEmployee) => {
                    return el.id === query.id;
                })[0] || "There is no such employee";

                res.end(JSON.stringify(response));
            } else {
                res.statusCode = 404;
                res.end("No id in request");
            }


        });
    }

    private static deleteEmployee(query: ParsedUrlQuery, res: any) {
        fs.readFile('./src/store/employees.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;

            if (query.id) {
                let employeeList = JSON.parse(data).filter((el: IEmployee) => {
                    return el.id !== query.id;
                });

                fs.writeFile('./src/store/employees.json', JSON.stringify(employeeList), (err: Error) => {
                    if (err) throw err;
                    res.end(JSON.stringify(employeeList));
                });
            } else {
                res.statusCode = 404;
                res.end("No id in request");
            }

        });
    }

    private static updateEmployee(query: ParsedUrlQuery, employeeData: any, res: any) {

        if (!query.id) {
            res.statusCode = 404;
            res.end("No Employee Id");
            return;
        }

        EmpService.updateEmployeeData(query.id, employeeData, (data: any, err: Error) => {
            if (err) throw err;
            res.end(JSON.stringify(data));
        });

    }

};
