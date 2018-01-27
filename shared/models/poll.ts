export interface IPoll{
    questions: IQuestion[]
}

export interface IQuestion{
    question: string,
    multiple: boolean,
    answers: IAnswer[]
}

export interface IAnswer{
    answer: string,
}