import { useMemo, useRef, useState, useEffect } from "react";
import { FieldValues, Path, UseFormSetValue, UseFormWatch } from "react-hook-form";
import debounce from 'lodash.debounce';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type FilterConfig<TForm extends FieldValues = FieldValues> = {
    key: Path<TForm>;
    type: 'debounced-text' | 'select' | 'toggle' | 'datepicker';
    normalKey?: Path<TForm>;
    defaultVisible?: boolean;
    debounceMs?: number;
    group?: string;
};

export const useFilters = <TForm extends FieldValues>(
    fields: FilterConfig<TForm>[],
    { setValue, watch }: { setValue: UseFormSetValue<TForm>, watch: UseFormWatch<TForm> },
    options?: { syncUrl?: boolean }
) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const syncUrl = options?.syncUrl ?? false;

    const initActiveFilters = (): Record<string, any> => {
        if (!syncUrl) return {};
        const initial: Record<string, any> = {};
        fields.forEach(field => {
            const value = searchParams.get(String(field.key));
            if (value) initial[String(field.key)] = value;
        });
        return initial;
    };

    const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initActiveFilters);
    const activeFiltersRef = useRef<Record<string, any>>(activeFilters);
    activeFiltersRef.current = activeFilters;
    const [anchor, setAnchor] = useState<EventTarget & HTMLButtonElement | null>(null);
    const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(fields.map(field => [field.key, field.defaultVisible ?? false]))
    );

    // Sync form values from URL on mount
    useEffect(() => {
        if (!syncUrl) return;
        fields.forEach(field => {
            const value = searchParams.get(String(field.key));
            if (value) {
                if (field.type === 'debounced-text') {
                    if (field.normalKey) setValue(field.normalKey as Path<TForm>, value as any);
                    setValue(field.key as Path<TForm>, value as any);
                } else if (field.type === 'toggle') {
                    setValue(field.key as Path<TForm>, (value === 'true') as any);
                } else {
                    setValue(field.key as Path<TForm>, value as any);
                }
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateUrl = (newActiveFilters: Record<string, any>) => {
        const params = new URLSearchParams(searchParams.toString());
        fields.forEach(field => {
            const value = newActiveFilters[String(field.key)];
            if (value) {
                params.set(String(field.key), value);
            } else {
                params.delete(String(field.key));
            }
        });
        const queryString = params.toString();
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    const updateUrlRef = useRef(updateUrl);
    updateUrlRef.current = updateUrl;

    const openFilters = Boolean(anchor);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedCommits = useMemo(() => Object.fromEntries(
        fields
            .filter(field => field.type === 'debounced-text')
            .map(field => [field.key, debounce((v: any, newActiveFilters: Record<string, any>) => {
                setValue(field.key as Path<TForm>, v);
                if (syncUrl) updateUrlRef.current(newActiveFilters);
            }, field.debounceMs ?? 500)])
    ), []);

    const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => setAnchor(event.currentTarget);
    const handleCloseFilters = () => setAnchor(null);

    const handleChange = (key: string, value: any) => {
        const field = fields.find(field => field.key === key)!;

        if (field.type === 'debounced-text') {
            if (field.normalKey) setValue(field.normalKey as Path<TForm>, value);
            const newActiveFilters = { ...activeFiltersRef.current };
            if (value) newActiveFilters[key] = value;
            else delete newActiveFilters[key];
            activeFiltersRef.current = newActiveFilters;
            setActiveFilters(newActiveFilters);
            debouncedCommits[key](value, newActiveFilters);
            return;
        }

        if (field.type === 'toggle') {
            const current = watch?.(key as Path<TForm>);
            setValue(key as Path<TForm>, !current as any);
        } else {
            setValue(key as Path<TForm>, value);
        };

        const newActiveFilters = { ...activeFiltersRef.current, [key]: value };
        activeFiltersRef.current = newActiveFilters;
        setActiveFilters(newActiveFilters);
        if (syncUrl) updateUrl(newActiveFilters);
    };

    const handleCleanFilter = (key: string) => {
        const field = fields.find(field => field.key === key)!;
        setValue(key as Path<TForm>, '' as any);
        if (field.normalKey) setValue(field.normalKey as Path<TForm>, '' as any);
        const newActiveFilters = { ...activeFiltersRef.current };
        delete newActiveFilters[key];
        activeFiltersRef.current = newActiveFilters;
        setActiveFilters(newActiveFilters);
        if (syncUrl) updateUrl(newActiveFilters);
    };

    const handleSelectFilter = (key: string) => {
        const picked = fields.find(f => String(f.key) === key);
        const groupKeys = picked?.group
            ? fields.filter(f => f.group === picked.group).map(f => String(f.key))
            : [key];
        setVisibility(Object.fromEntries(fields.map(f => [String(f.key), groupKeys.includes(String(f.key))])));
        setAnchor(null);
    };

    const handleCleanFilters = () => {
        fields.forEach(f => {
            setValue(f.key as Path<TForm>, '' as any);
            if (f.normalKey) setValue(f.normalKey as Path<TForm>, '' as any);
        });
        activeFiltersRef.current = {};
        setActiveFilters({});
        setVisibility(Object.fromEntries(fields.map(f => [f.key, f.defaultVisible ?? false])));
        setAnchor(null);
        if (syncUrl) updateUrl({});
    };

    return {
        anchor,
        openFilters,
        activeFilters,
        visibility,
        setVisibility,
        handleOpenFilters,
        handleCloseFilters,
        handleChange,
        handleSelectFilter,
        handleCleanFilter,
        handleCleanFilters,
    };
};
