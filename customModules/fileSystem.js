import fs from "fs";
console.log(fs);


fs.readFile('file.txt', 'utf8' , (error,data)=>{  //Async
    console.log("error : " + error);
    console.log("data : " + data);
})

try{ //Sync
    let data = fs.readFileSync('file.txt', 'utf8');
    // data = JSON.parse(data); // for Json data;
    console.log(data);
} 
catch(e){
    console.log(e);
}

//Write text to File if exists , otherwie create a new one and write;

fs.writeFile("file.txt","written", (error)=>{ //Async
    if(error){
        console.log(error);
    }
    else {
        console.log("Written Succesfully");
    }
})

try{ //Sync
    fs.writeFileSync('file.txt',", hello");
    console.log("written");
}
catch(e){
    console.log(e);
}


//Append text to File if exists , otherwie create a new one and Append;


fs.appendFile("file.txt","appended", (error)=>{ //Async
    if(error){
        console.log(error);
    } 
    else {
        console.log("Appended Succesfully");
    }
})


try{ //Sync
    fs.appendFileSync('file.txt',", hello");
    console.log("appended");
}
catch(e){
    console.log(e);
}


//Delete from file

fs.unlink("file.txt", (error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Deleted Succesfully");
    }
})