import TreeStore from "./TreeStore";
import * as readline from "readline";
import {items} from "./mock";
import {
    ELEMENT_NOT_FOUND,
    ENTER_COMMAND,
    ENTER_ID_ELEMENT, ERROR,
    EXIT,
    INVALID_COMMAND, IS_NEXT, YES
} from "./constants";
import {availableId, displayCommands, displayTable, lineDelimiter} from "./helpers";
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (prompt: string): Promise<any> => {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

export const getInputId = async (): Promise<number> => {
    const id: number = parseInt(await question(ENTER_ID_ELEMENT));
    return id;
}

const startTask = async () => {
    const ts: TreeStore = new TreeStore(items);

    while (true) {
        lineDelimiter()
        displayCommands();
        const command = await question(ENTER_COMMAND);

        if (command === EXIT) break;

        let success: boolean = true;

        try {
            switch (command) {
                case 'getAll':
                    displayTable(ts.getAll());
                    break;
                case 'getItem':
                    availableId()
                    const idForGetItem = await getInputId();
                    const itemForGetItem = ts.getItem(idForGetItem);
                    if (itemForGetItem) {
                        displayTable([itemForGetItem]);
                    } else {
                        console.log(chalk.red(ELEMENT_NOT_FOUND));
                    }
                    break;
                case 'getChildren':
                    availableId()
                    const idForGetChildren = await getInputId();
                    displayTable(ts.getChildren(idForGetChildren));
                    break;
                case 'getAllChildren':
                    availableId()
                    const idForGetAllChildren = await getInputId();
                    displayTable(ts.getAllChildren(idForGetAllChildren));
                    break;
                case 'getAllParents':
                    availableId()
                    const idForGetAllParents = await getInputId();
                    displayTable(ts.getAllParents(idForGetAllParents));
                    break;
                default:
                    lineDelimiter()
                    console.log(chalk.red(INVALID_COMMAND));
                    success = false;
            }
        } catch (error) {
            console.error(chalk.red(ERROR + (error as Error).message));
            success = false;
        }

        if (success) {
            const continueInput = await question(IS_NEXT);
            if (continueInput.toLowerCase() !== YES) break;
        }
    }

    rl.close();
}

(async () => await startTask())();