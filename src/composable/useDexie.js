import {ref, toRaw, watch} from 'vue'
import {db} from "../services/IndexedDBService.js";

export function useDexie(key, defaultValue) {
    const state = ref(defaultValue)

    db.settings.get(key).then(item => {
        if (item) {
            state.value = item.value
        }
    })

    watch(state, async (newVal) => {
        const rawVal = toRaw(newVal)
        await db.settings.put({ key, value: rawVal })
    }, { deep: true })


    return state
}
