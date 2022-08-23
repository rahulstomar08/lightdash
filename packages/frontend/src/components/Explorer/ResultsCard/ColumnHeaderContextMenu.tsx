import { Menu } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { fieldId, isField, isFilterableField } from '@lightdash/common';
import React from 'react';
import { useFilters } from '../../../hooks/useFilters';
import { useExplorer } from '../../../providers/ExplorerProvider';
import { useTracking } from '../../../providers/TrackingProvider';
import { EventName } from '../../../types/Events';
import { HeaderProps, TableColumn } from '../../common/Table/types';

const ColumnHeaderContextMenu: React.FC<HeaderProps> = ({
    children,
    header,
}) => {
    const { addFilter } = useFilters();
    const meta = header.column.columnDef.meta as TableColumn['meta'];
    const item = meta?.item;
    const { track } = useTracking();
    const {
        actions: { removeActiveField },
    } = useExplorer();

    if (item && isField(item) && isFilterableField(item)) {
        return (
            <Menu>
                <MenuItem2
                    text={`Filter by ${item.label}`}
                    icon={'filter'}
                    onClick={() => {
                        track({
                            name: EventName.ADD_FILTER_CLICKED,
                        });
                        addFilter(item, undefined, false);
                    }}
                />

                <MenuItem2
                    text="Remove"
                    icon="cross"
                    intent="danger"
                    onClick={() => {
                        removeActiveField(fieldId(item));
                    }}
                />
            </Menu>
        );
    } else if (meta?.isInvalidItem) {
        return (
            <Menu>
                <MenuItem2
                    text="Remove"
                    icon="cross"
                    intent="danger"
                    onClick={() => {
                        removeActiveField(header.column.id);
                    }}
                />
            </Menu>
        );
    } else {
        return <>{children}</>;
    }
};

export default ColumnHeaderContextMenu;
