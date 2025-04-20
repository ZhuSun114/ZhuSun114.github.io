interface ArrayDifference<T>{
    index: number;
    from: T;
    to: T;
}

export function differencesOfSameLengthArray<T = string>(olds: T[], news: T[]) {
    if (olds.length != news.length) return [];

    const differences: ArrayDifference<T>[] = [];
    for (let i = 0; i < olds.length; i++) {
        if (news[i] != olds[i]) {
            differences.push({
                index: i,
                from: olds[i],
                to: news[i]
            });
        }
    }
    return differences;
}
