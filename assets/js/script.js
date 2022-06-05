class Banker{
    constructor(input){

        this.allocation = input.allocation || [];
        this.max = input.max || [];
        this.available = input.available || [];

        // todo: validate input

        // get data
        this.processCount = this.allocation.length;
        this.resourceCount = this.allocation[0].length;
        this.need = this.computeNeedMatrix();

        this.printInput();
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
        console.log(need)
        return need;
    }

    printInput(){
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