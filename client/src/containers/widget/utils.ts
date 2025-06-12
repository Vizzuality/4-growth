interface ValueObject {
  value: number;
  [key: string]: string | number;
}

export function getIndexOfLargestValue(data: ValueObject[]): number {
  let index = 0;
  let largestValue = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].value > largestValue) {
      largestValue = data[i].value;
      index = i;
    }
  }

  return index;
}
