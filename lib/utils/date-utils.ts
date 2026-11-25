export type DateFilter = "today" | "week" | "payPeriod" | "lastPayPeriod" | "month";

// Pay periods are 14 days, beginning October 1, 2026.
const anchor = new Date(2026, 9, 1);

/** Returns the half-open date interval represented by the selected history filter. */
export function getDateRange(filter: DateFilter, now: Date) {
    if (filter === "today") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return { start, end };
    }

    if (filter === "month") {
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        };
    }

    if (filter === "week") {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Move back to Thursday
        start.setDate(start.getDate() - ((start.getDay() - 4 + 7) % 7));

        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        return { start, end };
    }

    // Compare calendar days rather than milliseconds to avoid DST issues.
    const calendarDay = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

    const daysSinceAnchor = calendarDay(now) - calendarDay(anchor);
    const periodOffset = Math.floor(daysSinceAnchor / 14) * 14;

    const start = new Date(anchor);
    start.setDate(start.getDate() + periodOffset);

    const end = new Date(start);
    end.setDate(end.getDate() + 14);

    if (filter === "lastPayPeriod") {
        const lastStart = new Date(start);
        lastStart.setDate(lastStart.getDate() - 14);

        return {
            start: lastStart,
            end: start,
        };
    }

    return { start, end };
}

/** Converts a Date object to a local date-time string. */
export function toLocalDateTimeString(date: Date) {
    const pad = (value: number) => String(value).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}