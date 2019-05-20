import {ParsedUrlQuery} from "querystring";
import {IEmployee} from "./employeeController";
import {EmployeeService} from "../services/employee.service";

const uniqid = require('uniqid');
const fs = require('fs');
const EmpService = new EmployeeService();

export interface IVacation {
    id: string,
    employeeId: string,
    startDate: string,
    endDate: string,
    numberOfDays: number
}


export default class VacationController implements IVacation {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    numberOfDays: number;


    constructor(props: { id: string; employeeId: string; startDate: string; endDate: string; numberOfDays: number; }) {
        this.id = props.id;
        this.employeeId = props.employeeId;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.numberOfDays = props.numberOfDays;
    }

    static dispatchVacation(method: string | SVGAnimatedEnumeration | undefined, query: ParsedUrlQuery, data: any, res: any) {

        switch (method) {
            case 'GET':
                this.getVacation(query, res);
                break;
            case 'POST':
                this.createVacation(data, res);
                break;
            case 'DELETE':
                this.deleteVacation(query, res);
                break;
            case 'PUT':
                this.updateVacation(query, data, res);
                break;
        }

    }

    static getVacationsOfEmployee(query: ParsedUrlQuery, res: any) {
        if (!query.id) {
            res.end("No Employee Id");
            return;
        }

        fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;
            const filteredVacations = JSON.parse(data).filter((el: IVacation) => {
                return el.employeeId === query.id;
            });

            res.end(JSON.stringify(filteredVacations));
        });
    }


    static getVacationOnDay(query: ParsedUrlQuery, res: any) {
        fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;
            console.log("d");
            if (!query.date) {
                res.end("No Date");
                return;
            }

            let searchDate = Number(query.date);

            let vacations = JSON.parse(data);

            let filteredVacations = vacations.filter((el: IVacation) => {
                return Number(el.startDate) < searchDate && searchDate < Number(el.endDate);
            });

            fs.readFile('./src/store/employees.json', 'utf8', (err: Error, data: string) => {

                let employeeData = JSON.parse(data);

                let response = filteredVacations.map((vacation: IVacation) => {
                    let employeeObject = employeeData.filter((employee: IEmployee) => {
                        return employee.id === vacation.employeeId;
                    })[0];

                    return {
                        endDate: vacation.endDate,
                        firstName: employeeObject ? employeeObject.firstName : "",
                        lastName: employeeObject ? employeeObject.lastName : "",
                        vacationDaysLeft: employeeObject ? employeeObject.vacationDaysLeft : ""

                    }
                });

                res.end(JSON.stringify(response));

            });

        });
    }

    static getVacations(res: any) {
        fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;
            res.end(data);
        });
    }

    static createVacation(vacationData: any, res: any) {
        fs.readFile('./src/store/employees.json', 'utf8', (err: Error, employeeData: string) => {
            if (err) throw err;

            if (!vacationData.employeeId) {
                res.end("No Employee Id");
                return;
            }

            if (!vacationData.startDate) {
                res.end("No Start Date");
                return;
            }

            if (!vacationData.numberOfDays) {
                res.end("No number of days");
                return;
            }


            let currentEmployee = JSON.parse(employeeData).filter((el: IEmployee) => {
                return el.id === vacationData.employeeId;
            })[0];

            if (currentEmployee && currentEmployee.vacationDaysLeft > vacationData.numberOfDays) {

                fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, vacationsData: string) => {
                    if (err) throw err;

                    let newVacationData = JSON.parse(vacationsData);

                    newVacationData.push({
                        id: uniqid(),
                        employeeId: vacationData.employeeId,
                        startDate: new Date(vacationData.startDate).getTime(),
                        endDate: new Date(vacationData.startDate + vacationData.numberOfDays * 24 * 60 * 60 * 1000).getTime(),
                        numberOfDays: vacationData.numberOfDays
                    });

                    EmpService.updateEmployeeData(vacationData.employeeId, {
                        vacationDaysLeft: currentEmployee.vacationDaysLeft - vacationData.numberOfDays
                    }, ({}, err: Error) => {
                        if (err) throw err;


                        fs.writeFile('./src/store/vacations.json', JSON.stringify(newVacationData), (err: Error) => {
                            if (err) throw err;

                            res.end(JSON.stringify(newVacationData));
                        });

                    });

                })

            } else {
                res.end("Not enough days");
            }

        });
    }

    static createNewVacationRequest(requestData: any, res: { setHeader: (arg0: string, arg1: string) => void }) {
        this.createVacation(requestData, res);
    }

    private static getVacation(query: ParsedUrlQuery, res: any) {
        fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;

            if (query.id) {
                let response = JSON.parse(data).filter((el: IVacation) => {
                    return el.id === query.id;
                })[0] || "There is no such vacation";

                res.end(JSON.stringify(response));
            } else {
                res.end("No id in request");
            }

        });
    }

    private static deleteVacation(query: ParsedUrlQuery, res: any) {

        fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;

            if (query.id) {
                let employeeList = JSON.parse(data).filter((el: IVacation) => {
                    return el.id !== query.id;
                });

                fs.writeFile('./src/store/vacations.json', JSON.stringify(employeeList), (err: Error) => {
                    if (err) throw err;
                    res.end(JSON.stringify(employeeList));
                });
            } else {
                res.end("No id in request");
            }

        });
    }

    private static updateVacation(query: ParsedUrlQuery, vacationsData: any, res: any) {

        fs.readFile('./src/store/vacations.json', 'utf8', (err: Error, data: string) => {
            if (err) throw err;

            if (query.id) {

                let newVacationData = JSON.parse(data).map((el: IVacation) => {
                    if (el.id === query.id) {
                        return {
                            id: el.id,
                            employeeId: vacationsData.employeeId || el.employeeId,
                            startDate: vacationsData.startDate || el.startDate,
                            endDate: vacationsData.endDate || el.endDate,
                            numberOfDays: vacationsData.numberOfDays || el.numberOfDays,
                        }
                    } else {
                        return el;
                    }
                });

                fs.writeFile('./src/store/vacations.json', JSON.stringify(newVacationData), (err: Error) => {
                    if (err) throw err;
                    res.end(JSON.stringify(newVacationData));
                });
            }
        })

    }
};

