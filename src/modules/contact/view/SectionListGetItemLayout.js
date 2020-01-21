
export function getSectionItemLayout(parameters, data, index) {
    let i = 0
    let sectionIndex = 0
    let elementPointer = {type: 'SECTION_HEADER'}
    let offset =
        typeof parameters.listHeaderHeight === 'function'
            ? parameters.listHeaderHeight()
            : parameters.listHeaderHeight

    while (i < index) {
        switch (elementPointer.type) {
            case 'SECTION_HEADER': {
                const sectionData = data[sectionIndex].data

                offset += parameters.getSectionHeaderHeight(sectionIndex)

                // If this section is empty, we go right to the footer...
                if (sectionData.length === 0) {
                    elementPointer = {type: 'SECTION_FOOTER'}
                    // ...otherwise we make elementPointer point at the first row in this section
                } else {
                    elementPointer = {type: 'ROW', index: 0}
                }

                break
            }
            case 'ROW': {
                const sectionData = data[sectionIndex].data

                const rowIndex = elementPointer.index

                offset += parameters.getItemHeight(sectionData[rowIndex], sectionIndex, rowIndex)
                elementPointer.index += 1

                if (rowIndex === sectionData.length - 1) {
                    elementPointer = {type: 'SECTION_FOOTER'}
                } else {
                    offset += parameters.getSeparatorHeight(sectionIndex, rowIndex)
                }

                break
            }
            case 'SECTION_FOOTER': {
                offset += parameters.getSectionFooterHeight(sectionIndex)
                sectionIndex += 1
                elementPointer = {type: 'SECTION_HEADER'}
                break
            }
        }

        i += 1
    }

    let length
    switch (elementPointer.type) {
        case 'SECTION_HEADER':
            length = parameters.getSectionHeaderHeight(sectionIndex)
            break
        case 'ROW':
            const rowIndex = elementPointer.index
            length = parameters.getItemHeight(
                data[sectionIndex].data[rowIndex],
                sectionIndex,
                rowIndex,
            )
            break
        case 'SECTION_FOOTER':
            length = parameters.getSectionFooterHeight(sectionIndex)
            break
        default:
            throw new Error('Unknown elementPointer.type')
    }

    return {length, offset, index}
}