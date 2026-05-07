"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Check,
  Loader2,
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetMenuVariations } from "@/hooks/useMenus";
import {
  blockInvalidNumberKeys,
  blockNegativeNumberPaste,
  sanitizeNonNegativeNumber,
} from "@/utils/numberInput";

type StepThreeProps = {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

type SelectableEntity = {
  id: string;
  name: string;
  description?: string;
  price?: string | number;
  priceDelta?: string | number;
  isActive?: boolean;
  sortOrder?: number;
};

type ModifierPriceOverride = {
  modifierId: string;
  priceDelta: string;
};

type VariationPriceOverride = {
  variationId: string;
  price: string;
  pickupPrice: string;
  displayText: string;
  modifierPriceOverrides: ModifierPriceOverride[];
};

const PAGE_LIMIT = 20;

const normalizeArray = (value: any): any[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [];
};

const normalizeIds = (
  sources: any[],
  type: "variation" | "modifier"
): string[] => {
  const ids = new Set<string>();

  sources.forEach((source) => {
    normalizeArray(source).forEach((entry) => {
      if (entry === null || entry === undefined) return;

      if (typeof entry === "string" || typeof entry === "number") {
        ids.add(String(entry));
        return;
      }

      if (type === "variation") {
        const modifierId = entry?.modifierId || entry?.modifier?.id;
        const variationId = entry?.variationId || entry?.variation?.id;

        if (modifierId && !variationId) return;

        const id =
          variationId ||
          (entry?.name !== undefined ||
          entry?.categoryId !== undefined ||
          entry?.sku !== undefined ||
          entry?.description !== undefined ||
          entry?.isActive !== undefined
            ? entry?.id
            : undefined);

        if (id) ids.add(String(id));
        return;
      }

      const id =
        entry?.modifierId ||
        entry?.modifier?.id ||
        (entry?.name !== undefined ||
        entry?.priceDelta !== undefined ||
        entry?.restaurantId !== undefined ||
        entry?.isActive !== undefined
          ? entry?.id
          : undefined);

      if (id) ids.add(String(id));
    });
  });

  return Array.from(ids);
};

const extractResponseItems = (response: any, entityKey: string) => {
  if (!response) return [];

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  const candidates = [
    response?.data?.items,
    response?.data?.[entityKey],
    response?.data?.data?.items,
    response?.data?.data?.[entityKey],
    response?.data?.data,
    response?.items,
    response?.[entityKey],
    response?.data,
    response,
  ];

  const raw = candidates.find((candidate) => Array.isArray(candidate));

  return Array.isArray(raw) ? raw : [];
};

const getPaginationHasMore = ({
  response,
  page,
  limit,
  receivedCount,
}: {
  response: any;
  page: number;
  limit: number;
  receivedCount: number;
}) => {
  const source =
    response?.data?.pagination ||
    response?.data?.meta ||
    response?.pagination ||
    response?.meta ||
    {};

  if (typeof source?.hasNext === "boolean") return source.hasNext;
  if (typeof source?.hasMore === "boolean") return source.hasMore;

  const currentPage = Number(source?.page ?? page);
  const totalPages = Number(source?.totalPages ?? source?.pages ?? 0);
  const total = Number(source?.total ?? 0);

  if (totalPages > 0) return currentPage < totalPages;
  if (total > 0) return page * limit < total;

  return receivedCount >= limit;
};

const mergeUniqueById = <T extends { id?: string }>(prev: T[], next: T[]) => {
  const map = new Map<string, T>();

  [...prev, ...next].forEach((item) => {
    const id = String(item?.id || "");
    if (!id) return;
    map.set(id, item);
  });

  return Array.from(map.values());
};

const hasUsableName = (value: any) => {
  return typeof value === "string" && value.trim().length > 0;
};

const getVariationSnapshot = (entry: any): SelectableEntity | null => {
  if (!entry) return null;

  const source = entry?.variation || entry?.menuVariation || entry;
  const id =
    entry?.variationId ||
    entry?.variation?.id ||
    entry?.menuVariation?.id ||
    source?.id;
  const name = source?.name || entry?.displayText || entry?.name;

  if (!id || !hasUsableName(name)) return null;

  return {
    id: String(id),
    name: String(name),
    description: source?.description,
    price: source?.price ?? entry?.price,
    priceDelta: source?.priceDelta ?? entry?.priceDelta,
    isActive:
      typeof source?.isActive === "boolean"
        ? source.isActive
        : typeof entry?.isActive === "boolean"
        ? entry.isActive
        : undefined,
    sortOrder: source?.sortOrder ?? entry?.sortOrder,
  };
};

const mergeEntitySnapshots = (
  previous: any[],
  next: any[]
): SelectableEntity[] => {
  const map = new Map<string, SelectableEntity>();

  normalizeArray(previous).forEach((entry) => {
    const snapshot = getVariationSnapshot(entry);
    if (snapshot?.id) map.set(String(snapshot.id), snapshot);
  });

  normalizeArray(next).forEach((entry) => {
    const snapshot = getVariationSnapshot(entry);
    if (snapshot?.id) map.set(String(snapshot.id), snapshot);
  });

  return Array.from(map.values());
};

const setVariationSnapshot = (
  map: Map<string, SelectableEntity>,
  entry: any,
  options?: { overwrite?: boolean }
) => {
  const snapshot = getVariationSnapshot(entry);
  if (!snapshot?.id) return;

  const id = String(snapshot.id);
  const existing = map.get(id);

  if (!existing || options?.overwrite) {
    map.set(id, snapshot);
    return;
  }

  map.set(id, {
    ...snapshot,
    ...existing,
    name: existing.name || snapshot.name,
  });
};

const resolveVariationDisplayText = ({
  existingDisplayText,
  variationName,
  variationId,
}: {
  existingDisplayText?: string;
  variationName?: string;
  variationId: string;
}) => {
  const existing = String(existingDisplayText || "").trim();
  const generatedFallback = `Variation ${variationId}`;

  if (existing && existing !== generatedFallback) return existing;

  return variationName || existing || "";
};

const isValidNonNegativeNumber = (value: any) => {
  if (value === "" || value === null || value === undefined) return false;

  const numeric = Number(value);

  return !Number.isNaN(numeric) && numeric >= 0;
};

const getItemBasePrice = (form: any) => {
  return sanitizeNonNegativeNumber(String(form?.basePrice ?? "0")) || "0";
};

const normalizeTopLevelModifierOverrides = (
  raw: any[]
): ModifierPriceOverride[] => {
  return normalizeArray(raw)
    .filter((entry) => entry?.modifierId && !entry?.variationId)
    .map((entry) => ({
      modifierId: String(entry.modifierId),
      priceDelta: sanitizeNonNegativeNumber(String(entry.priceDelta ?? "")),
    }));
};

const normalizeNestedModifierOverrides = (
  raw: any[]
): ModifierPriceOverride[] => {
  return normalizeArray(raw)
    .filter((entry) => entry?.modifierId)
    .map((entry) => ({
      modifierId: String(entry.modifierId),
      priceDelta: sanitizeNonNegativeNumber(String(entry.priceDelta ?? "")),
    }));
};

const normalizeVariationPriceOverrides = (
  raw: any[]
): VariationPriceOverride[] => {
  return normalizeArray(raw)
    .filter((entry) => entry?.variationId)
    .map((entry) => ({
      variationId: String(entry.variationId),
      price:
        entry?.price !== undefined && entry?.price !== null
          ? sanitizeNonNegativeNumber(String(entry.price))
          : "",
      pickupPrice:
        entry?.pickupPrice !== undefined && entry?.pickupPrice !== null
          ? sanitizeNonNegativeNumber(String(entry.pickupPrice))
          : "",
      displayText:
        entry?.displayText !== undefined && entry?.displayText !== null
          ? String(entry.displayText)
          : "",
      modifierPriceOverrides: normalizeNestedModifierOverrides(
        entry?.modifierPriceOverrides
      ),
    }));
};

const getInvalidVariationIdsFromModifierOverrideRecords = (form: any) => {
  const invalidIds = new Set<string>();

  normalizeArray(form?.modifierPriceOverrides).forEach((entry) => {
    const isTopLevelModifierOverride =
      entry?.id && entry?.modifierId && !entry?.variationId;

    if (isTopLevelModifierOverride) {
      invalidIds.add(String(entry.id));
    }
  });

  normalizeArray(form?.variationPriceOverrides).forEach((variationOverride) => {
    normalizeArray(variationOverride?.modifierPriceOverrides).forEach(
      (modifierOverride) => {
        const isNestedModifierOverride =
          modifierOverride?.id && modifierOverride?.modifierId;

        if (isNestedModifierOverride) {
          invalidIds.add(String(modifierOverride.id));
        }
      }
    );
  });

  return invalidIds;
};

const resolveModifierIdsFromForm = (form: any) => {
  if (Array.isArray(form?.modifierIds)) {
    return normalizeIds([form.modifierIds], "modifier");
  }

  const nestedModifierOverrides = normalizeArray(
    form?.variationPriceOverrides
  ).flatMap((entry) => entry?.modifierPriceOverrides || []);

  return normalizeIds(
    [
      form?.modifiers,
      form?.itemModifiers,
      form?.modifierPriceOverrides,
      nestedModifierOverrides,
    ],
    "modifier"
  );
};

const StepThree = forwardRef(({ form, setForm }: StepThreeProps, ref: any) => {
  const { restaurantId: authRestaurantId } = useAuth();
  const restaurantId = authRestaurantId ?? undefined;
  const canFetchOptions = Boolean(restaurantId);

  const [variationSearch, setVariationSearch] = useState("");
  const [debouncedVariationSearch, setDebouncedVariationSearch] = useState("");
  const [variationPage, setVariationPage] = useState(1);
  const [variationOptions, setVariationOptions] = useState<SelectableEntity[]>(
    []
  );
  const [variationHasMore, setVariationHasMore] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = variationSearch.trim();

      setVariationPage(1);
      setVariationHasMore(true);
      setDebouncedVariationSearch(nextSearch);
    }, 350);

    return () => clearTimeout(timer);
  }, [variationSearch]);

  useEffect(() => {
    if (!restaurantId) return;

    setVariationPage(1);
    setVariationOptions([]);
    setVariationHasMore(true);
  }, [restaurantId]);

  const selectedVariationIds = useMemo(() => {
    const invalidVariationIds =
      getInvalidVariationIdsFromModifierOverrideRecords(form);

    const rawIds = Array.isArray(form?.variationIds)
      ? normalizeIds([form.variationIds], "variation")
      : normalizeIds(
          [
            form?.variations,
            form?.itemVariations,
            form?.variationLinks,
            form?.variationPriceOverrides,
          ],
          "variation"
        );

    return rawIds.filter((id) => !invalidVariationIds.has(String(id)));
  }, [
    form?.variationIds,
    form?.variations,
    form?.itemVariations,
    form?.variationLinks,
    form?.variationPriceOverrides,
    form?.modifierPriceOverrides,
  ]);

  const {
    data: variationsResponse,
    isLoading: loadingVariations,
    isFetching: fetchingVariations,
  } = useGetMenuVariations({
    page: variationPage,
    limit: PAGE_LIMIT,
    restaurantId,
    search: debouncedVariationSearch || undefined,
  });

  useEffect(() => {
    if (!canFetchOptions || !variationsResponse) return;

    const nextItems = extractResponseItems(variationsResponse, "variations");

    setVariationOptions((prev) =>
      variationPage === 1 ? nextItems : mergeUniqueById(prev, nextItems)
    );

    setVariationHasMore(
      getPaginationHasMore({
        response: variationsResponse,
        page: variationPage,
        limit: PAGE_LIMIT,
        receivedCount: nextItems.length,
      })
    );
  }, [variationsResponse, variationPage, canFetchOptions]);

  const variationMap = useMemo(() => {
    const map = new Map<string, SelectableEntity>();

    normalizeArray(form?.selectedVariationOptions).forEach((item: any) => {
      setVariationSnapshot(map, item);
    });

    variationOptions.forEach((item: any) => {
      setVariationSnapshot(map, item, { overwrite: true });
    });

    normalizeArray(form?.variations).forEach((item: any) => {
      setVariationSnapshot(map, item);

      if (item?.variation?.id) {
        setVariationSnapshot(map, item.variation);
      }
    });

    normalizeArray(form?.itemVariations).forEach((item: any) => {
      setVariationSnapshot(map, item);

      if (item?.variation?.id) {
        setVariationSnapshot(map, item.variation);
      }
    });

    normalizeArray(form?.variationLinks).forEach((item: any) => {
      setVariationSnapshot(map, item);

      if (item?.variation?.id) {
        setVariationSnapshot(map, item.variation);
      }
    });

    normalizeArray(form?.variationPriceOverrides).forEach((entry: any) => {
      setVariationSnapshot(map, entry);

      if (entry?.variation?.id) {
        setVariationSnapshot(map, entry.variation);
      }
    });

    return map;
  }, [
    variationOptions,
    form?.selectedVariationOptions,
    form?.variations,
    form?.itemVariations,
    form?.variationLinks,
    form?.variationPriceOverrides,
  ]);

  const selectedVariations = useMemo(
    () =>
      selectedVariationIds.map((id) => {
        const variation = variationMap.get(String(id));

        return {
          ...variation,
          id: String(id),
          name: variation?.name || `Variation ${id}`,
        };
      }),
    [selectedVariationIds, variationMap]
  );

  const variationPriceOverrides = useMemo(
    () => normalizeVariationPriceOverrides(form?.variationPriceOverrides),
    [form?.variationPriceOverrides]
  );

  useEffect(() => {
    setForm((prev: any) => {
      const basePrice = getItemBasePrice(prev);
      const modifierIds = resolveModifierIdsFromForm(prev);
      const topLevelModifierOverrides = normalizeTopLevelModifierOverrides(
        prev?.modifierPriceOverrides
      );
      const currentVariationOverrides = normalizeVariationPriceOverrides(
        prev?.variationPriceOverrides
      );

      const nextVariationOverrides: VariationPriceOverride[] =
        selectedVariationIds.map((variationId) => {
          const existing = currentVariationOverrides.find(
            (entry) => String(entry.variationId) === String(variationId)
          );

          const variation = variationMap.get(String(variationId));

          const nestedModifierOverrides = modifierIds.map((modifierId) => {
            const existingNested = existing?.modifierPriceOverrides?.find(
              (entry) => String(entry.modifierId) === String(modifierId)
            );

            const topLevel = topLevelModifierOverrides.find(
              (entry) => String(entry.modifierId) === String(modifierId)
            );

            return {
              modifierId: String(modifierId),
              priceDelta:
                existingNested?.priceDelta !== undefined &&
                existingNested?.priceDelta !== null &&
                existingNested.priceDelta !== ""
                  ? existingNested.priceDelta
                  : topLevel?.priceDelta || "0",
            };
          });

          return {
            variationId: String(variationId),
            price:
              existing?.price !== undefined &&
              existing?.price !== null &&
              existing.price !== ""
                ? existing.price
                : basePrice,
            pickupPrice:
              existing?.pickupPrice !== undefined &&
              existing?.pickupPrice !== null
                ? existing.pickupPrice
                : "",
            displayText: resolveVariationDisplayText({
              existingDisplayText: existing?.displayText,
              variationName: variation?.name,
              variationId: String(variationId),
            }),
            modifierPriceOverrides: nestedModifierOverrides,
          };
        });

      const nextState = {
        ...prev,
        variationIds: selectedVariationIds,
        variationPriceOverrides: nextVariationOverrides,
      };

      const didChange =
        JSON.stringify(prev?.variationIds || []) !==
          JSON.stringify(nextState.variationIds) ||
        JSON.stringify(
          normalizeVariationPriceOverrides(prev?.variationPriceOverrides)
        ) !== JSON.stringify(nextState.variationPriceOverrides);

      return didChange ? nextState : prev;
    });
  }, [selectedVariationIds.join("|"), variationMap, form?.basePrice, setForm]);

  const validateStep = () => {
    if (!restaurantId) {
      toast.error("Restaurant id is missing");
      return false;
    }

    const basePrice = getItemBasePrice(form);

    if (!isValidNonNegativeNumber(basePrice)) {
      toast.error("Base price must be a valid non-negative number");
      return false;
    }

    const normalizedTopModifierOverrides = normalizeTopLevelModifierOverrides(
      form?.modifierPriceOverrides
    );
    const normalizedVariationOverrides = normalizeVariationPriceOverrides(
      form?.variationPriceOverrides
    );
    const modifierIds = resolveModifierIdsFromForm(form);

    for (const variationId of selectedVariationIds) {
      const override = normalizedVariationOverrides.find(
        (entry) => String(entry.variationId) === String(variationId)
      );

      const variationPrice =
        override?.price !== undefined &&
        override?.price !== null &&
        override.price !== ""
          ? override.price
          : basePrice;

      if (!isValidNonNegativeNumber(variationPrice)) {
        toast.error("Variation prices must be valid non-negative numbers");
        return false;
      }

      if (
        override?.pickupPrice !== "" &&
        override?.pickupPrice !== undefined &&
        override?.pickupPrice !== null &&
        !isValidNonNegativeNumber(override.pickupPrice)
      ) {
        toast.error(
          "Variation pickup prices must be valid non-negative numbers"
        );
        return false;
      }
    }

    const finalVariationOverrides = selectedVariationIds.map((variationId) => {
      const existing = normalizedVariationOverrides.find(
        (entry) => String(entry.variationId) === String(variationId)
      );

      const variation = variationMap.get(String(variationId));

      return {
        variationId: String(variationId),
        price: existing?.price || basePrice,
        pickupPrice: existing?.pickupPrice || "",
        displayText: resolveVariationDisplayText({
          existingDisplayText: existing?.displayText,
          variationName: variation?.name,
          variationId: String(variationId),
        }),
        modifierPriceOverrides: modifierIds.map((modifierId) => {
          const nestedExisting = existing?.modifierPriceOverrides?.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          const topLevel = normalizedTopModifierOverrides.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          return {
            modifierId: String(modifierId),
            priceDelta:
              nestedExisting?.priceDelta || topLevel?.priceDelta || "0",
          };
        }),
      };
    });

    setForm((prev: any) => ({
      ...prev,
      variationIds: selectedVariationIds,
      variationPriceOverrides: finalVariationOverrides,
    }));

    return true;
  };

  useImperativeHandle(ref, () => ({
    validateStep,
  }));

  const getVariationPrice = (variationId: string) => {
    const override = variationPriceOverrides.find(
      (entry) => String(entry.variationId) === String(variationId)
    );

    if (
      override?.price !== undefined &&
      override?.price !== null &&
      override.price !== ""
    ) {
      return override.price;
    }

    return getItemBasePrice(form);
  };

  const toggleVariation = (id: string) => {
    setForm((prev: any) => {
      const currentIds = normalizeIds([prev?.variationIds], "variation");
      const exists = currentIds.includes(id);

      const nextIds = exists
        ? currentIds.filter((entry) => entry !== id)
        : [...currentIds, id];

      const selectedVariation =
        variationMap.get(String(id)) ||
        variationOptions.find((item) => String(item?.id || "") === String(id));

      return {
        ...prev,
        variationIds: nextIds,
        selectedVariationOptions: selectedVariation
          ? mergeEntitySnapshots(prev?.selectedVariationOptions, [
              selectedVariation,
            ])
          : normalizeArray(prev?.selectedVariationOptions),
      };
    });
  };

  const clearVariations = () => {
    setForm((prev: any) => ({
      ...prev,
      variationIds: [],
      variationPriceOverrides: [],
    }));
  };

  const handleVariationPriceChange = ({
    variationId,
    value,
  }: {
    variationId: string;
    value: string;
  }) => {
    const sanitized = sanitizeNonNegativeNumber(value);

    setForm((prev: any) => {
      const current = normalizeVariationPriceOverrides(
        prev?.variationPriceOverrides
      );
      const basePrice = getItemBasePrice(prev);

      const exists = current.some(
        (entry) => String(entry.variationId) === String(variationId)
      );

      const next = exists
        ? current.map((entry) =>
            String(entry.variationId) === String(variationId)
              ? {
                  ...entry,
                  price: sanitized,
                }
              : entry
          )
        : [
            ...current,
            {
              variationId,
              price: sanitized || basePrice,
              pickupPrice: "",
              displayText: variationMap.get(String(variationId))?.name || "",
              modifierPriceOverrides: [],
            },
          ];

      return {
        ...prev,
        variationPriceOverrides: next,
      };
    });
  };

  const loadMoreVariations = () => {
    if (!variationHasMore || fetchingVariations || loadingVariations) return;
    setVariationPage((prev) => prev + 1);
  };

  return (
    <div className="w-full min-w-0 space-y-6 overflow-hidden">
      <div className="rounded-[18px] border border-primary/10 bg-primary/5 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary text-white">
            <Sparkles size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">
              Variation Configuration
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Select reusable variations for this item. Once selected, the item
              base price is prefilled inline and can be overridden immediately.
            </p>
          </div>
        </div>
      </div>

      <VariationSelectionSection
        title="Assign Variations"
        description="Choose one or more size, portion, or serving options for this item."
        icon={<SlidersHorizontal size={18} />}
        searchValue={variationSearch}
        onSearchChange={setVariationSearch}
        searchPlaceholder="Search variations..."
        loading={
          (loadingVariations || fetchingVariations) &&
          variationOptions.length === 0
        }
        loadingMore={variationPage > 1 && fetchingVariations}
        hasMore={variationHasMore}
        onLoadMore={loadMoreVariations}
        items={variationOptions}
        selectedIds={selectedVariationIds}
        selectedVariations={selectedVariations}
        emptyTitle="No variations found"
        emptyDescription="Create master variations first, then attach them to this item."
        onToggle={toggleVariation}
        onClear={clearVariations}
        getPriceValue={getVariationPrice}
        onPriceChange={handleVariationPriceChange}
      />
    </div>
  );
});

StepThree.displayName = "StepThree";

export default StepThree;

type VariationSelectionSectionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  items: SelectableEntity[];
  selectedIds: string[];
  selectedVariations: SelectableEntity[];
  emptyTitle: string;
  emptyDescription: string;
  onToggle: (id: string) => void;
  onClear: () => void;
  getPriceValue: (variationId: string) => string;
  onPriceChange: (payload: { variationId: string; value: string }) => void;
};

function VariationSelectionSection({
  title,
  description,
  icon,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  items,
  selectedIds,
  selectedVariations,
  emptyTitle,
  emptyDescription,
  onToggle,
  onClear,
  getPriceValue,
  onPriceChange,
}: VariationSelectionSectionProps) {
  const selectedMap = useMemo(() => {
    const map = new Map<string, SelectableEntity>();

    selectedVariations.forEach((item) => {
      if (item?.id) map.set(String(item.id), item);
    });

    return map;
  }, [selectedVariations]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 32) {
      if (hasMore && !loading && !loadingMore) {
        onLoadMore();
      }
    }
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gray-100 text-gray-700">
            {icon}
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                {title}
              </h3>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {selectedIds.length} selected
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {selectedIds.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="h-[38px] shrink-0 rounded-[12px] border-gray-200 text-sm"
          >
            Clear
          </Button>
        ) : null}
      </div>

      {selectedIds.length > 0 ? (
        <div className="mb-4 flex max-h-[92px] flex-wrap gap-2 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:thin]">
          {selectedIds.map((id) => {
            const item = selectedMap.get(String(id));

            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggle(String(id))}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10"
              >
                <span className="max-w-[180px] truncate">
                  {item?.name || `Selected ${id}`}
                </span>
                <X size={14} className="shrink-0" />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-[44px] rounded-[14px] border-gray-200 bg-[#FAFAFA] pl-11 text-sm focus:border-primary focus:ring-primary/15"
        />
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-[16px] border border-gray-100 bg-[#FAFAFA] p-3">
        {loading ? (
          <div className="flex min-h-[170px] items-center justify-center text-gray-500">
            <Loader2 className="mr-2 animate-spin" size={20} />
            Loading options...
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[170px] flex-col items-center justify-center rounded-[14px] border border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-gray-900">{emptyTitle}</p>
            <p className="mt-1 max-w-[320px] text-sm text-gray-500">
              {emptyDescription}
            </p>
          </div>
        ) : (
          <div
            className="grid max-h-[430px] gap-3 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:thin]"
            onScroll={handleScroll}
          >
            {items.map((item) => {
              const id = String(item?.id || "");
              const selected = selectedIds.includes(id);

              if (!id) return null;

              return (
                <div
                  key={id}
                  className={`w-full min-w-0 rounded-[14px] border bg-white p-4 transition ${
                    selected
                      ? "border-primary shadow-sm ring-2 ring-primary/10"
                      : "border-gray-100 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => onToggle(id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 bg-white text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <p className="max-w-full truncate text-sm font-semibold text-gray-900">
                            {item?.name || "Unnamed"}
                          </p>

                          {!selected ? (
                            item?.isActive === false ? (
                              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                Inactive
                              </span>
                            ) : (
                              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                Active
                              </span>
                            )
                          ) : null}
                        </div>
                      </div>
                    </button>

                    {selected ? (
                      <div className="w-full shrink-0 sm:ml-auto sm:w-[160px]">
                      

                        <Input
                          type="number"
                          min={0}
                          value={getPriceValue(id)}
                          onKeyDown={blockInvalidNumberKeys}
                          onPaste={blockNegativeNumberPaste}
                          onChange={(event) =>
                            onPriceChange({
                              variationId: id,
                              value: event.target.value,
                            })
                          }
                          onClick={(event) => event.stopPropagation()}
                          placeholder="0"
                          className="h-[40px] min-w-0 rounded-[12px] border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary/15"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {loadingMore ? (
              <div className="flex items-center justify-center py-3 text-sm text-gray-500">
                <Loader2 className="mr-2 animate-spin" size={16} />
                Loading more...
              </div>
            ) : null}

            {!loadingMore && hasMore ? (
              <button
                type="button"
                onClick={onLoadMore}
                className="rounded-[12px] border border-dashed border-gray-200 bg-white py-2 text-center text-xs font-medium text-gray-500 transition hover:border-primary/30 hover:text-primary"
              >
                Load more
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
