const url = require('url');
import EmployeeController from '../controllers/employeeController';
import VacationsController from '../controllers/vacationController';

const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const GET = 'GET';

const dateOfServerStart = new Date();

const getServerWorkTime = () => {
    return (new Date()).getTime() - dateOfServerStart.getTime();
};


export const dispatch = (req: {
    method: string;
    url: string;
    on: (arg0: string, arg1: (data: string) => void) => { on: (arg0: string, arg1: () => void) => void }
}, res: {
    setHeader: (arg0: string, arg1: string) => void
    end(text: string): void;
}, jsonData: {}) => {

    const urlParsed = url.parse(req.url, true);
    let path = urlParsed.pathname;
    let query = urlParsed.query;
    let method = req.method;


    switch (path) {
        case `/employee`:
            EmployeeController.dispatchEmployee(method, query, jsonData, res);
            break;
        case `/employees`:
            if (method === GET) EmployeeController.getEmployees(res);
            break;
        case `/vacations`:
            if (method === GET) VacationsController.getVacations(res);
            break;
        case '/vacation':
            VacationsController.dispatchVacation(method, query, jsonData, res);
            break;
        case `/new-vacation-request`:
            if (method === POST) VacationsController.createNewVacationRequest(jsonData, res);
            break;
        case `/employee-vacations`:
            if (method === GET) VacationsController.getVacationsOfEmployee(query, res);
            break;
        case '/vacations-on-date':
            if (method === GET) VacationsController.getVacationOnDay(query, res);
            break;
        case '/health-check':
            res.end(JSON.stringify({
                startTime: dateOfServerStart,
                workTime: getServerWorkTime()
            }));
            break;
        default:
            res.end('No such route')
    }
};
