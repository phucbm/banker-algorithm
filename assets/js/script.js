class Banker{
    constructor(input){
        this.log = {
            calc: true,
            result: true,
            process: true
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
    }

    request(p_index, p_request){
        const available = [...this.available];
        const p_need = this.need[p_index];

        if(this.log.process) console.log(`P${p_index + 1} requests [${p_request.join(',')}]`);

        // request <= need
        if(!this.isVectorALessThanOrEqualToB(p_request, p_need)){
            if(this.log.result) console.warn(`Request rejected! [${p_request.join(',')}] asks more than it needs [${p_need.join(',')}]`);
            return false;
        }

        // request <= available
        if(!this.isVectorALessThanOrEqualToB(p_request, available)){
            if(this.log.result) console.warn('Request ON HOLD due to system is not available.');
            return false;
        }

        // check if system is safe with this request
        const temp_available = this.minusVector(available, p_request);
        const temp_allocation = [...this.allocation];
        temp_allocation[p_index] = this.sumVector(temp_allocation[p_index], p_request);
        const temp_need = [...this.need];
        temp_need[p_index] = this.minusVector(temp_need[p_index], p_request);

        const isSystemSafe = this.isSystemSafe({
            available: temp_available,
            allocation: temp_allocation,
            need: temp_need
        });

        // system is not safe
        if(!isSystemSafe){
            if(this.log.result) console.warn('Request ON HOLD due to system unsafe.');
            return false;
        }

        // allocate resource
        if(this.log.result) console.log('Request is being processed...');
        // todo: allocate resource
    }

    isSystemSafe({
                     available = [...this.available],
                     allocation = [...this.allocation],
                     need = [...this.need]
                 } = {}){

        // init finish array to all false
        const finish = [];
        available.forEach((item, index) => finish[index] = false);

        // check if all finish is true
        const isAllFinished = () => finish.filter(val => val === true).length === finish.length;

        let loop = 0, max = Math.pow(this.processCount * this.resourceCount, 2);
        let unsafeDetected = false;
        do{
            loop++;
            // step 2: find process
            let check = 0;
            for(let i = 0; i < available.length; i++){
                if(!finish[i] && this.isVectorALessThanOrEqualToB(need[i], available)){
                    // step 3: update work
                    available = this.sumVector(available, allocation[i]);
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

        return isAllFinished();
    }

    minusVector(a, b){
        const result = [];
        for(let i = 0; i < a.length; i++){
            result.push(a[i] - b[i]);
        }
        if(this.log.calc) console.log('Minus:', a.join(','), '-', b.join(','), '=', result.join(','))
        return result;
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