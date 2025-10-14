// write your JS code here
const employees = [
   { name: 'John', salary: { basic: 20000, bonus: 5000 } },
   { name: 'Alice', salary: { basic: 25000 } }, // No bonus field
   { name: 'Bob' }, // No salary field
   { name: 'Carol', salary: { basic: 30000, bonus: 10000 } }
];
function getEmployeeSalary(employeeName){
    let totalSalary  =0;
    let nameFlag = false;
    employees.forEach(employee=>{
        if(employee.hasOwnProperty("name")){
            if(employee.name == employeeName){ 
                nameFlag = true;
                if(employee.salary){
                    for(let key in employee.salary){
                        totalSalary += employee.salary[key];
                    }
                }
            }
        }
        
    });
    if(!nameFlag) return `Employee [${employeeName}] not found`;
    if (totalSalary == 0) return `Salary details not available for [${employeeName}]`;
    return "Total Salary for [" + employeeName + "] is: " + totalSalary;
}

console.log(getEmployeeSalary("John"));
console.log(getEmployeeSalary("Alice"));
console.log(getEmployeeSalary("Bob"));