class Banker{
    constructor(input){
        this.log = {
            calc: false,
            result: true
        };

        this.allocation = input.allocation || [];
        this.max = input.max || [];
        this.available = input.available || [];

        // todo: validate input

        // get data
        this.processCount = this.allocation.length; // m
        this.resourceCount = this.allocation[0].length; // n
        this.need = this.computeNeedMatrix();

        this.printInput();
        this.isSystemSafe();
    }

    isSystemSafe(){
        let work = [...this.available];
        const finish = [];
        work.forEach((item, index) => {
            finish[index] = false;
        });
        const isAllFinished = () => finish.filter(val => val === true).length === finish.length;

        let loop = 0, max = Math.pow(this.processCount * this.resourceCount, 2);
        let unsafeDetected = false;
        do{
            loop++;
            // step 2: find process
            let check = 0;
            for(let i = 0; i < work.length; i++){
                if(!finish[i] && this.isVectorALessThanOrEqualToB(this.need[i], work)){
                    // step 3: update work
                    work = this.sumVector(work, this.allocation[i]);
                    finish[i] = true;
                    break; // break loop and move to step 2
                }
                check++;
            }

            // all are unfinished
            if(check === finish.length){
                console.log('Unsafe detected');
                unsafeDetected = true;
                break;
            }

            if(loop > max){
                console.log('Timeout');
                break;
            }
        }
        while(!isAllFinished() && !unsafeDetected);
        if(this.log.result) console.log('Is system safe?', isAllFinished(), finish);
    }

    sumVector(a, b){
        const result = [];
        for(let i = 0; i < a.length; i++){
            result.push(a[i] + b[i]);
        }
        if(this.log.calc) console.log('Sum:', a.join(','), '+', b.join(','), '=', result.join(','))
        return result;
    }

    isVectorALessThanOrEqualToB(a, b){
        let result = true;
        for(let i = 0; i < a.length; i++){
            if(a[i] > b[i]){
                result = false;
                break;
            }
        }
        if(this.log.calc) console.log('Compare:', a.join(','), '<=', b.join(','), result);
        return result;
    }

    computeNeedMatrix(){
        const need = [];
        for(let i = 0; i < this.processCount; i++){
            const p_need = []
            for(let j = 0; j < this.resourceCount; j++){
                const p_max = this.max[i][j];
                const p_allocation = this.allocation[i][j];
                p_need.push(p_max - p_allocation);
            }
            need.push(p_need);
        }
        return need;
    }

    printInput(){
        if(!this.log.result) return;

        console.log('---> Allocation')
        console.table(this.allocation);
        console.log('---> Max')
        console.table(this.max);
        console.log('---> Need')
        console.table(this.need);
        console.log('---> Available')
        console.table(this.available);
    }
}