import {
    GiDiceSixFacesOne,
    GiDiceSixFacesTwo,
    GiDiceSixFacesThree,
    GiDiceSixFacesFour,
    GiDiceSixFacesFive,
    GiDiceSixFacesSix
} from 'vue-icons-plus/gi'

export function getDiceIcon(diceNumber) {
    const icons = {
        1: GiDiceSixFacesOne,
        2: GiDiceSixFacesTwo,
        3: GiDiceSixFacesThree,
        4: GiDiceSixFacesFour,
        5: GiDiceSixFacesFive,
        6: GiDiceSixFacesSix
    }

    return icons[diceNumber] || GiDiceSixFacesOne // fallback на 1
}