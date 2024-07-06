import { Observable, Subject } from 'rxjs';
import {
    SimpleIcon,
    siGoogle,
    siFirebase
} from 'simple-icons';

export interface IconsInterface {
    [key: string]: SimpleIcon;
}

export interface PositionEntity {
    x: number;
    y: number;
}

export const DEVICONS: IconsInterface = {
    google: siGoogle,
    firebase: siFirebase
};

export interface StylesEntity {
    [key: string]: string;
}

export interface StyleSubjects {
    [key: string]: Subject<StylesEntity>;
}

export interface StyleObservers {
    [key: string]: Observable<StylesEntity>;
}
