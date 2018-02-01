export interface IPoll{
    questions: IQuestion[],
    links?: IPollLinks,
    status?: IPollStatus,
    id?: number
}

export interface IPollStatus{
    state: 'NOT_STARTED' | 'STARTED' | 'FINISHED',
    step: number
}


export interface IPollLinks {
    vote: string,
    results: string,
    admin: string
}

export interface IQuestion{
    question: string,
    multiple: boolean,
    answers: IAnswer[]
}

export interface IAnswer{
    answer: string,
    votes: number
}