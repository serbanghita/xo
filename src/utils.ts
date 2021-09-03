// Returns only the unique values of an array.
// eg. input [1,1,1] returns [1]
// eg. input [1,2,1] returns [1,2]
export function unique(arr: number[]): number[] {
    return arr.reduce((acc: number[], currentValue: number) => {
        if (!acc.includes(currentValue)) { acc.push(currentValue); }
        return acc;
    }, []);
}