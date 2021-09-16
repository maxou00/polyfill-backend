
export const timeUtils = {
    /**
     * 
     * @param date 
     * @returns the date formatted as YYYY-mm-dd
     */
    dateInEnCA(date: Date) {
        return date.toLocaleDateString("en-CA").split(",")[0];
    },
    padZero(value: number) {
        if(value > 9) {
            return ''+value;
        }
        return  '0'+value;
    },

    toInt(time: string) {
        if(!time) {
            return undefined;
        }
        let splitted = time.split(":");
        let hour = splitted[0];
        let minutes = splitted[1];
    
        let timins = 0;
        if(minutes) {
            let parsed = parseInt(minutes) || 0;
            timins +=parsed;
        }
        if(hour) {
            let parsed = parseInt(hour) || 0;
            timins += parsed *60;
        }
        return timins;
    },

    asString(time: number | undefined) {
        if(!time) {
            return undefined;
        }
        let hours = Math.floor(time / 60);
        let minutes = time % 60;
        return `${this.padZero(hours)}:${this.padZero(minutes)}`;
    }
}