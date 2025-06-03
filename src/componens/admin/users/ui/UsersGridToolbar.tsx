import { AddRounded } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridSlotProps, Toolbar, ToolbarButton } from "@mui/x-data-grid";


export function UsersGridToolbar(props: GridSlotProps['toolbar']) {

    const handleClick = () => {
        props.add();
    };

    return (
        <Toolbar>
            <Tooltip title="Add record">
                <ToolbarButton onClick={handleClick}>
                    <AddRounded fontSize="small" />
                </ToolbarButton>
            </Tooltip>
        </Toolbar>
    );
}
