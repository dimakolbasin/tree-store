import {items} from "./mock";
import {Item} from "./interfaces";
import {AVAILABLE_COMMANDS, AVAILABLE_ID, ELEMENT_NOT_FOUND} from "./constants";
const chalk = require('chalk');


export const getAllId = (): string => {
    return items.map(item => item.id).join(', ');
};

export const displayTable = (data: Item | Item[] | null): void => {
    if (!data) {
        console.log(chalk.red(ELEMENT_NOT_FOUND));
        return;
    }

    console.table(data, ['id', 'parent', 'type']);
}

export const displayCommands = (): void => {
    console.log(chalk.green(AVAILABLE_COMMANDS));
    lineDelimiter()
    console.log('- getAll: Вывести все элементы');
    console.log('- getItem: Вывести элемент по id');
    console.log('- getChildren: Вывести дочерние элементы по id');
    console.log('- getAllChildren: Вывести все дочерние элементы по id');
    console.log('- getAllParents: Вывести всех родителей элемента по id');
    lineDelimiter()
    console.log('- exit: Выйти из программы');
}

export const availableId = (): void => {
    console.log(AVAILABLE_ID, getAllId())
}

export const lineDelimiter = (): void => {
    console.log('--------------------------------------------------------');
}