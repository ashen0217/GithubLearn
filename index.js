import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path ="./data.json"
const date = moment().subtract(5,'d').format();





const markComits = (n) => {
    const x = random.default.int(0,54);
    const y = random.default.int(0,6);
    const date = moment().subtract(1,"y").add(1,"d").add(x,"w").add(y,"d").format();

    const data = {
        date: date,
    };

    jsonfile.writeFile(path, data,()=>{
        simpleGit().add([path]).commit(date,{'--date':date}).push();


    });
};


