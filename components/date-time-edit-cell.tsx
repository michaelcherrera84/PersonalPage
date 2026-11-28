import { toLocalDateTimeString } from "@/lib/utils/date-utils";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";

export function DateTimeEditCell(params: GridRenderEditCellParams) {
    const { id, field, value, api } = params;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        api.setEditCellValue({
            id,
            field,
            value: newValue ? new Date(newValue) : null,
        });
    };

    const handleClear = () => {
        api.setEditCellValue({
            id,
            field,
            value: null,
        });
    };

    return (
        <TextField
            type="datetime-local"
            size="small"
            fullWidth
            value={value ? toLocalDateTimeString(new Date(value)) : ""}
            onChange={handleChange}
            slotProps={{
                input: {
                    endAdornment: value ? (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                edge="end"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                },
            }}
        />
    );
}