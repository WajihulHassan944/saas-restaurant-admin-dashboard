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
import { useGetMenuVariations, useGetModifiers } from "@/hooks/useMenus";
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
  modifierGroups?: any[];
  groupLinks?: any[];
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

type FlatModifierVariationOverride = {
  modifierId: string;
  variationId: string;
  priceDelta: string;
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
        const id = entry?.variationId || entry?.variation?.id || entry?.id;
        if (id) ids.add(String(id));
        return;
      }

      const id = entry?.modifierId || entry?.modifier?.id || entry?.id;
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

const getModifierGroupNames = (modifier: any) => {
  const directGroups = Array.isArray(modifier?.modifierGroups)
    ? modifier.modifierGroups
    : [];

  const linkedGroups = Array.isArray(modifier?.groupLinks)
    ? modifier.groupLinks
        .map((link: any) => link?.modifierGroup)
        .filter(Boolean)
    : [];

  const unique = new Map<string, any>();

  [...directGroups, ...linkedGroups].forEach((group: any) => {
    const id = String(group?.id || "");
    if (!id) return;
    if (!unique.has(id)) unique.set(id, group);
  });

  return Array.from(unique.values())
    .map((group: any) => group?.name)
    .filter(Boolean);
};

const formatAmount = (value: any) => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) return "0.00";
  return numeric.toFixed(2);
};

const hasPositiveAmount = (value: any) => {
  const numeric = Number(value ?? 0);
  return !Number.isNaN(numeric) && numeric > 0;
};

const isValidNonNegativeNumber = (value: any) => {
  if (value === "" || value === null || value === undefined) return false;

  const numeric = Number(value);

  return !Number.isNaN(numeric) && numeric >= 0;
};

const getModifierBasePrice = (modifier?: SelectableEntity) => {
  return sanitizeNonNegativeNumber(String(modifier?.priceDelta ?? 0));
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

const normalizeFlatModifierVariationOverrides = (
  raw: any[]
): FlatModifierVariationOverride[] => {
  return normalizeArray(raw)
    .filter((entry) => entry?.modifierId && entry?.variationId)
    .map((entry) => ({
      modifierId: String(entry.modifierId),
      variationId: String(entry.variationId),
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

const StepThree = forwardRef(({ form, setForm }: StepThreeProps, ref: any) => {
  const { restaurantId: authRestaurantId } = useAuth();
  const restaurantId = authRestaurantId ?? undefined;
  const canFetchOptions = Boolean(restaurantId);

  const [variationSearch, setVariationSearch] = useState("");
  const [modifierSearch, setModifierSearch] = useState("");

  const [debouncedVariationSearch, setDebouncedVariationSearch] = useState("");
  const [debouncedModifierSearch, setDebouncedModifierSearch] = useState("");

  const [variationPage, setVariationPage] = useState(1);
  const [modifierPage, setModifierPage] = useState(1);

  const [variationOptions, setVariationOptions] = useState<SelectableEntity[]>(
    []
  );
  const [modifierOptions, setModifierOptions] = useState<SelectableEntity[]>(
    []
  );

  const [variationHasMore, setVariationHasMore] = useState(true);
  const [modifierHasMore, setModifierHasMore] = useState(true);

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
    const timer = setTimeout(() => {
      const nextSearch = modifierSearch.trim();

      setModifierPage(1);
      setModifierHasMore(true);
      setDebouncedModifierSearch(nextSearch);
    }, 350);

    return () => clearTimeout(timer);
  }, [modifierSearch]);

  useEffect(() => {
    if (!restaurantId) return;

    setVariationPage(1);
    setModifierPage(1);

    setVariationOptions([]);
    setModifierOptions([]);

    setVariationHasMore(true);
    setModifierHasMore(true);
  }, [restaurantId]);

  const selectedVariationIds = useMemo(() => {
    if (Array.isArray(form?.variationIds)) {
      return normalizeIds([form.variationIds], "variation");
    }

    return normalizeIds(
      [
        form?.variations,
        form?.itemVariations,
        form?.variationLinks,
        form?.variationPriceOverrides,
      ],
      "variation"
    );
  }, [
    form?.variationIds,
    form?.variations,
    form?.itemVariations,
    form?.variationLinks,
    form?.variationPriceOverrides,
  ]);

  const selectedModifierIds = useMemo(() => {
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
        form?.modifierLinks,
        form?.modifierPriceOverrides,
        nestedModifierOverrides,
      ],
      "modifier"
    );
  }, [
    form?.modifierIds,
    form?.modifiers,
    form?.itemModifiers,
    form?.modifierLinks,
    form?.modifierPriceOverrides,
    form?.variationPriceOverrides,
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

  const {
    data: modifiersResponse,
    isLoading: loadingModifiers,
    isFetching: fetchingModifiers,
  } = useGetModifiers({
    page: modifierPage,
    limit: PAGE_LIMIT,
    restaurantId,
    search: debouncedModifierSearch || undefined,
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

  useEffect(() => {
    if (!canFetchOptions || !modifiersResponse) return;

    const nextItems = extractResponseItems(modifiersResponse, "modifiers");

    setModifierOptions((prev) =>
      modifierPage === 1 ? nextItems : mergeUniqueById(prev, nextItems)
    );

    setModifierHasMore(
      getPaginationHasMore({
        response: modifiersResponse,
        page: modifierPage,
        limit: PAGE_LIMIT,
        receivedCount: nextItems.length,
      })
    );
  }, [modifiersResponse, modifierPage, canFetchOptions]);

  const variationMap = useMemo(() => {
    const map = new Map<string, SelectableEntity>();

    variationOptions.forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);
    });

    normalizeArray(form?.variations).forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);

      if (item?.variation?.id) {
        map.set(String(item.variation.id), item.variation);
      }
    });

    normalizeArray(form?.itemVariations).forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);

      if (item?.variation?.id) {
        map.set(String(item.variation.id), item.variation);
      }
    });

    return map;
  }, [variationOptions, form?.variations, form?.itemVariations]);

  const modifierMap = useMemo(() => {
    const map = new Map<string, SelectableEntity>();

    modifierOptions.forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);
    });

    normalizeArray(form?.modifiers).forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);

      if (item?.modifier?.id) {
        map.set(String(item.modifier.id), item.modifier);
      }
    });

    normalizeArray(form?.modifierLinks).forEach((link: any) => {
      if (link?.modifier?.id) {
        map.set(String(link.modifier.id), link.modifier);
      }
    });

    return map;
  }, [modifierOptions, form?.modifiers, form?.modifierLinks]);

  const selectedVariations = useMemo(
    () =>
      selectedVariationIds.map((id) => ({
        id,
        name: variationMap.get(id)?.name || `Variation ${id}`,
        ...variationMap.get(id),
      })),
    [selectedVariationIds, variationMap]
  );

  const selectedModifiers = useMemo(
    () =>
      selectedModifierIds.map((id) => ({
        id,
        name: modifierMap.get(id)?.name || `Modifier ${id}`,
        ...modifierMap.get(id),
      })),
    [selectedModifierIds, modifierMap]
  );

  const topLevelModifierOverrides = useMemo(
    () => normalizeTopLevelModifierOverrides(form?.modifierPriceOverrides),
    [form?.modifierPriceOverrides]
  );

  const variationPriceOverrides = useMemo(
    () => normalizeVariationPriceOverrides(form?.variationPriceOverrides),
    [form?.variationPriceOverrides]
  );

  useEffect(() => {
    setForm((prev: any) => {
      const basePrice = getItemBasePrice(prev);

      const currentTopOverrides = normalizeTopLevelModifierOverrides(
        prev?.modifierPriceOverrides
      );

      const oldFlatVariationModifierOverrides =
        normalizeFlatModifierVariationOverrides(prev?.modifierPriceOverrides);

      const currentVariationOverrides = normalizeVariationPriceOverrides(
        prev?.variationPriceOverrides
      );

      const nextTopModifierOverrides: ModifierPriceOverride[] =
        selectedModifierIds.map((modifierId) => {
          const existing = currentTopOverrides.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          const modifier = modifierMap.get(String(modifierId));
          const defaultPrice = getModifierBasePrice(modifier);

          return {
            modifierId: String(modifierId),
            priceDelta:
              existing?.priceDelta !== undefined &&
              existing?.priceDelta !== null &&
              existing.priceDelta !== ""
                ? existing.priceDelta
                : defaultPrice,
          };
        });

      const nextVariationOverrides: VariationPriceOverride[] =
        selectedVariationIds.map((variationId) => {
          const existing = currentVariationOverrides.find(
            (entry) => String(entry.variationId) === String(variationId)
          );

          const variation = variationMap.get(String(variationId));

          const nestedModifierOverrides = selectedModifierIds.map(
            (modifierId) => {
              const existingNested = existing?.modifierPriceOverrides?.find(
                (entry) => String(entry.modifierId) === String(modifierId)
              );

              const oldFlat = oldFlatVariationModifierOverrides.find(
                (entry) =>
                  String(entry.variationId) === String(variationId) &&
                  String(entry.modifierId) === String(modifierId)
              );

              const topLevel = nextTopModifierOverrides.find(
                (entry) => String(entry.modifierId) === String(modifierId)
              );

              const modifier = modifierMap.get(String(modifierId));
              const defaultPrice =
                topLevel?.priceDelta !== undefined &&
                topLevel?.priceDelta !== null &&
                topLevel.priceDelta !== ""
                  ? topLevel.priceDelta
                  : getModifierBasePrice(modifier);

              return {
                modifierId: String(modifierId),
                priceDelta:
                  existingNested?.priceDelta !== undefined &&
                  existingNested?.priceDelta !== null &&
                  existingNested.priceDelta !== ""
                    ? existingNested.priceDelta
                    : oldFlat?.priceDelta !== undefined &&
                      oldFlat?.priceDelta !== null &&
                      oldFlat.priceDelta !== ""
                    ? oldFlat.priceDelta
                    : defaultPrice,
              };
            }
          );

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
            displayText:
              existing?.displayText !== undefined &&
              existing?.displayText !== null &&
              existing.displayText !== ""
                ? existing.displayText
                : variation?.name || "",
            modifierPriceOverrides: nestedModifierOverrides,
          };
        });

      const nextState = {
        ...prev,
        variationIds: selectedVariationIds,
        modifierIds: selectedModifierIds,
        modifierPriceOverrides: nextTopModifierOverrides,
        variationPriceOverrides: nextVariationOverrides,
      };

      const didChange =
        JSON.stringify(prev?.variationIds || []) !==
          JSON.stringify(nextState.variationIds) ||
        JSON.stringify(prev?.modifierIds || []) !==
          JSON.stringify(nextState.modifierIds) ||
        JSON.stringify(
          normalizeTopLevelModifierOverrides(prev?.modifierPriceOverrides)
        ) !== JSON.stringify(nextState.modifierPriceOverrides) ||
        JSON.stringify(
          normalizeVariationPriceOverrides(prev?.variationPriceOverrides)
        ) !== JSON.stringify(nextState.variationPriceOverrides);

      return didChange ? nextState : prev;
    });
  }, [
    selectedVariationIds.join("|"),
    selectedModifierIds.join("|"),
    variationMap,
    modifierMap,
    form?.basePrice,
    setForm,
  ]);

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

    for (const modifierId of selectedModifierIds) {
      const override = normalizedTopModifierOverrides.find(
        (entry) => String(entry.modifierId) === String(modifierId)
      );

      const priceDelta = override?.priceDelta ?? "0";

      if (!isValidNonNegativeNumber(priceDelta)) {
        toast.error("Modifier prices must be valid non-negative numbers");
        return false;
      }
    }

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
        toast.error("Variation pickup prices must be valid non-negative numbers");
        return false;
      }

      if (selectedModifierIds.length > 0) {
        for (const modifierId of selectedModifierIds) {
          const nestedOverride = override?.modifierPriceOverrides?.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          const topLevel = normalizedTopModifierOverrides.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          const priceDelta =
            nestedOverride?.priceDelta !== undefined &&
            nestedOverride?.priceDelta !== null &&
            nestedOverride.priceDelta !== ""
              ? nestedOverride.priceDelta
              : topLevel?.priceDelta || "0";

          if (!isValidNonNegativeNumber(priceDelta)) {
            toast.error(
              "Modifier variation prices must be valid non-negative numbers"
            );
            return false;
          }
        }
      }
    }

    const finalTopOverrides = selectedModifierIds.map((modifierId) => {
      const existing = normalizedTopModifierOverrides.find(
        (entry) => String(entry.modifierId) === String(modifierId)
      );

      return {
        modifierId: String(modifierId),
        priceDelta: existing?.priceDelta || "0",
      };
    });

    const finalVariationOverrides = selectedVariationIds.map((variationId) => {
      const existing = normalizedVariationOverrides.find(
        (entry) => String(entry.variationId) === String(variationId)
      );

      const variation = variationMap.get(String(variationId));

      return {
        variationId: String(variationId),
        price: existing?.price || basePrice,
        pickupPrice: existing?.pickupPrice || "",
        displayText: existing?.displayText || variation?.name || "",
        modifierPriceOverrides: selectedModifierIds.map((modifierId) => {
          const nestedExisting = existing?.modifierPriceOverrides?.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          const topLevel = finalTopOverrides.find(
            (entry) => String(entry.modifierId) === String(modifierId)
          );

          return {
            modifierId: String(modifierId),
            priceDelta: nestedExisting?.priceDelta || topLevel?.priceDelta || "0",
          };
        }),
      };
    });

    setForm((prev: any) => ({
      ...prev,
      variationIds: selectedVariationIds,
      modifierIds: selectedModifierIds,
      modifierPriceOverrides: finalTopOverrides,
      variationPriceOverrides: finalVariationOverrides,
    }));

    return true;
  };

  useImperativeHandle(ref, () => ({
    validateStep,
  }));

  const toggleSelection = (
    field: "variationIds" | "modifierIds",
    id: string
  ) => {
    setForm((prev: any) => {
      const currentIds =
        field === "variationIds"
          ? normalizeIds([prev?.variationIds], "variation")
          : normalizeIds([prev?.modifierIds], "modifier");

      const exists = currentIds.includes(id);

      const nextIds = exists
        ? currentIds.filter((entry) => entry !== id)
        : [...currentIds, id];

      return {
        ...prev,
        [field]: nextIds,
      };
    });
  };

  const clearSelection = (field: "variationIds" | "modifierIds") => {
    setForm((prev: any) => ({
      ...prev,
      [field]: [],
    }));
  };

  const handleTopLevelModifierChange = ({
    modifierId,
    priceDelta,
  }: {
    modifierId: string;
    priceDelta: string;
  }) => {
    const sanitized = sanitizeNonNegativeNumber(priceDelta);

    setForm((prev: any) => {
      const current = normalizeTopLevelModifierOverrides(
        prev?.modifierPriceOverrides
      );

      const exists = current.some(
        (entry) => String(entry.modifierId) === String(modifierId)
      );

      const next = exists
        ? current.map((entry) =>
            String(entry.modifierId) === String(modifierId)
              ? {
                  ...entry,
                  priceDelta: sanitized,
                }
              : entry
          )
        : [
            ...current,
            {
              modifierId,
              priceDelta: sanitized,
            },
          ];

      return {
        ...prev,
        modifierPriceOverrides: next,
      };
    });
  };

  const handleVariationFieldChange = ({
    variationId,
    key,
    value,
  }: {
    variationId: string;
    key: "price" | "pickupPrice" | "displayText";
    value: string;
  }) => {
    const nextValue =
      key === "displayText" ? value : sanitizeNonNegativeNumber(value);

    setForm((prev: any) => {
      const current = normalizeVariationPriceOverrides(
        prev?.variationPriceOverrides
      );

      const exists = current.some(
        (entry) => String(entry.variationId) === String(variationId)
      );

      const next = exists
        ? current.map((entry) =>
            String(entry.variationId) === String(variationId)
              ? {
                  ...entry,
                  [key]: nextValue,
                }
              : entry
          )
        : [
            ...current,
            {
              variationId,
              price: key === "price" ? nextValue : getItemBasePrice(prev),
              pickupPrice: key === "pickupPrice" ? nextValue : "",
              displayText: key === "displayText" ? nextValue : "",
              modifierPriceOverrides: [],
            },
          ];

      return {
        ...prev,
        variationPriceOverrides: next,
      };
    });
  };

  const handleNestedModifierChange = ({
    variationId,
    modifierId,
    priceDelta,
  }: {
    variationId: string;
    modifierId: string;
    priceDelta: string;
  }) => {
    const sanitized = sanitizeNonNegativeNumber(priceDelta);

    setForm((prev: any) => {
      const current = normalizeVariationPriceOverrides(
        prev?.variationPriceOverrides
      );

      const variationExists = current.some(
        (entry) => String(entry.variationId) === String(variationId)
      );

      const next = variationExists
        ? current.map((variation) => {
            if (String(variation.variationId) !== String(variationId)) {
              return variation;
            }

            const nested = normalizeNestedModifierOverrides(
              variation.modifierPriceOverrides
            );

            const modifierExists = nested.some(
              (entry) => String(entry.modifierId) === String(modifierId)
            );

            const nextNested = modifierExists
              ? nested.map((entry) =>
                  String(entry.modifierId) === String(modifierId)
                    ? {
                        ...entry,
                        priceDelta: sanitized,
                      }
                    : entry
                )
              : [
                  ...nested,
                  {
                    modifierId,
                    priceDelta: sanitized,
                  },
                ];

            return {
              ...variation,
              modifierPriceOverrides: nextNested,
            };
          })
        : [
            ...current,
            {
              variationId,
              price: getItemBasePrice(prev),
              pickupPrice: "",
              displayText: "",
              modifierPriceOverrides: [
                {
                  modifierId,
                  priceDelta: sanitized,
                },
              ],
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

  const loadMoreModifiers = () => {
    if (!modifierHasMore || fetchingModifiers || loadingModifiers) return;
    setModifierPage((prev) => prev + 1);
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
              Item Configuration
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Select reusable variations and modifiers, then configure item-level
              variation prices and modifier prices.
            </p>
          </div>
        </div>
      </div>

      <InfiniteMultiSelectSection
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
        selectedMap={variationMap}
        emptyTitle="No variations found"
        emptyDescription="Create master variations first, then attach them to this item."
        onToggle={(id) => toggleSelection("variationIds", id)}
        onClear={() => clearSelection("variationIds")}
        renderMeta={(item) => (
          <>
            {hasPositiveAmount(item?.price) ? (
              <span>Base: ${formatAmount(item?.price)}</span>
            ) : null}
            {item?.isActive === false ? (
              <span>Inactive</span>
            ) : (
              <span>Active</span>
            )}
          </>
        )}
      />

      <InfiniteMultiSelectSection
        title="Assign Modifiers"
        description="Choose add-ons or extras that should be available for this item only."
        icon={<Sparkles size={18} />}
        searchValue={modifierSearch}
        onSearchChange={setModifierSearch}
        searchPlaceholder="Search modifiers..."
        loading={
          (loadingModifiers || fetchingModifiers) &&
          modifierOptions.length === 0
        }
        loadingMore={modifierPage > 1 && fetchingModifiers}
        hasMore={modifierHasMore}
        onLoadMore={loadMoreModifiers}
        items={modifierOptions}
        selectedIds={selectedModifierIds}
        selectedMap={modifierMap}
        emptyTitle="No modifiers found"
        emptyDescription="Create master modifiers first, then attach them to this item."
        onToggle={(id) => toggleSelection("modifierIds", id)}
        onClear={() => clearSelection("modifierIds")}
        renderMeta={(item) => {
          const groups = getModifierGroupNames(item);

          return (
            <>
              {hasPositiveAmount(item?.priceDelta) ? (
                <span>Base delta: ${formatAmount(item?.priceDelta)}</span>
              ) : null}

              {groups.length ? (
                <span title={groups.join(", ")}>
                  Group: {groups[0]}
                  {groups.length > 1 ? ` +${groups.length - 1}` : ""}
                </span>
              ) : (
                <span>No group</span>
              )}
            </>
          );
        }}
      />

      <ModifierBasePriceSection
        modifiers={selectedModifiers}
        overrides={topLevelModifierOverrides}
        onChange={handleTopLevelModifierChange}
      />

      <VariationPricingMatrix
        basePrice={getItemBasePrice(form)}
        variations={selectedVariations}
        modifiers={selectedModifiers}
        variationOverrides={variationPriceOverrides}
        topLevelModifierOverrides={topLevelModifierOverrides}
        onVariationChange={handleVariationFieldChange}
        onNestedModifierChange={handleNestedModifierChange}
      />
    </div>
  );
});

StepThree.displayName = "StepThree";

export default StepThree;

type InfiniteMultiSelectSectionProps = {
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
  selectedMap: Map<string, SelectableEntity>;
  emptyTitle: string;
  emptyDescription: string;
  onToggle: (id: string) => void;
  onClear: () => void;
  renderMeta: (item: SelectableEntity) => React.ReactNode;
};

function InfiniteMultiSelectSection({
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
  selectedMap,
  emptyTitle,
  emptyDescription,
  onToggle,
  onClear,
  renderMeta,
}: InfiniteMultiSelectSectionProps) {
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
            className="grid max-h-[330px] gap-3 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:thin]"
            onScroll={handleScroll}
          >
            {items.map((item) => {
              const id = String(item?.id || "");
              const selected = selectedIds.includes(id);

              if (!id) return null;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onToggle(id)}
                  className={`w-full min-w-0 rounded-[14px] border bg-white p-4 text-left transition ${
                    selected
                      ? "border-primary shadow-sm ring-2 ring-primary/10"
                      : "border-gray-100 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${
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

                        {item?.isActive === false ? (
                          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            Inactive
                          </span>
                        ) : null}
                      </div>

                      {item?.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="mt-2 flex min-w-0 flex-wrap gap-2 text-xs text-gray-500">
                        {renderMeta(item)}
                      </div>
                    </div>
                  </div>
                </button>
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

function ModifierBasePriceSection({
  modifiers,
  overrides,
  onChange,
}: {
  modifiers: SelectableEntity[];
  overrides: ModifierPriceOverride[];
  onChange: (payload: { modifierId: string; priceDelta: string }) => void;
}) {
  const getValue = (modifier: SelectableEntity) => {
    const existing = overrides.find(
      (entry) => String(entry.modifierId) === String(modifier.id)
    );

    if (existing) return existing.priceDelta;

    return getModifierBasePrice(modifier);
  };

  if (!modifiers.length) return null;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900">
          Modifier Base Prices
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          These prices are saved as item-level modifier overrides and are also
          used as defaults for variation-specific modifier prices.
        </p>
      </div>

      <div className="grid gap-3">
        {modifiers.map((modifier) => (
          <div
            key={modifier.id}
            className="grid w-full min-w-0 gap-3 rounded-[14px] border border-gray-100 bg-[#FAFAFA] p-3 sm:grid-cols-[minmax(0,1fr)_150px]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {modifier.name}
              </p>

              {hasPositiveAmount(modifier.priceDelta) ? (
                <p className="mt-0.5 text-xs text-gray-500">
                  Master delta: ${formatAmount(modifier.priceDelta)}
                </p>
              ) : null}
            </div>

            <Input
              type="number"
              min={0}
              value={getValue(modifier)}
              onKeyDown={blockInvalidNumberKeys}
              onPaste={blockNegativeNumberPaste}
              onChange={(event) =>
                onChange({
                  modifierId: String(modifier.id),
                  priceDelta: event.target.value,
                })
              }
              placeholder="0"
              className="h-[40px] min-w-0 rounded-[12px] border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary/15"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function VariationPricingMatrix({
  basePrice,
  variations,
  modifiers,
  variationOverrides,
  topLevelModifierOverrides,
  onVariationChange,
  onNestedModifierChange,
}: {
  basePrice: string;
  variations: SelectableEntity[];
  modifiers: SelectableEntity[];
  variationOverrides: VariationPriceOverride[];
  topLevelModifierOverrides: ModifierPriceOverride[];
  onVariationChange: (payload: {
    variationId: string;
    key: "price" | "pickupPrice" | "displayText";
    value: string;
  }) => void;
  onNestedModifierChange: (payload: {
    variationId: string;
    modifierId: string;
    priceDelta: string;
  }) => void;
}) {
  const getVariationOverride = (variationId: string) => {
    return variationOverrides.find(
      (entry) => String(entry.variationId) === String(variationId)
    );
  };

  const getNestedModifierValue = (
    variationId: string,
    modifier: SelectableEntity
  ) => {
    const variationOverride = getVariationOverride(variationId);

    const nested = variationOverride?.modifierPriceOverrides?.find(
      (entry) => String(entry.modifierId) === String(modifier.id)
    );

    if (nested) return nested.priceDelta;

    const topLevel = topLevelModifierOverrides.find(
      (entry) => String(entry.modifierId) === String(modifier.id)
    );

    if (topLevel) return topLevel.priceDelta;

    return getModifierBasePrice(modifier);
  };

  if (!variations.length) {
    return (
      <section className="rounded-[20px] border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-gray-900">
          No variation pricing yet
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Select variations to configure item-level variation prices.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">
            Variation Pricing
          </h3>

          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {variations.length} selected
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Variation price defaults to the item base price. You can override it
          for each selected variation.
        </p>
      </div>

      <div className="max-h-[620px] space-y-4 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:thin]">
        {variations.map((variation) => {
          const override = getVariationOverride(String(variation.id));

          const variationPrice =
            override?.price !== undefined &&
            override?.price !== null &&
            override.price !== ""
              ? override.price
              : basePrice;

          return (
            <div
              key={variation.id}
              className="w-full min-w-0 rounded-[18px] border border-gray-100 bg-[#FAFAFA] p-4"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-gray-900">
                    {variation.name}
                  </h4>

                  {hasPositiveAmount(variation?.price) ? (
                    <p className="mt-0.5 text-xs text-gray-500">
                      Master price: ${formatAmount(variation.price)}
                    </p>
                  ) : null}
                </div>

                {variation?.isActive === false ? (
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                    Inactive
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    Variation Price
                  </p>

                  <Input
                    type="number"
                    min={0}
                    value={variationPrice}
                    onKeyDown={blockInvalidNumberKeys}
                    onPaste={blockNegativeNumberPaste}
                    onChange={(event) =>
                      onVariationChange({
                        variationId: String(variation.id),
                        key: "price",
                        value: event.target.value,
                      })
                    }
                    placeholder={basePrice || "0"}
                    className="h-[40px] rounded-[12px] border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary/15"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    Pickup Price
                  </p>

                  <Input
                    type="number"
                    min={0}
                    value={override?.pickupPrice || ""}
                    onKeyDown={blockInvalidNumberKeys}
                    onPaste={blockNegativeNumberPaste}
                    onChange={(event) =>
                      onVariationChange({
                        variationId: String(variation.id),
                        key: "pickupPrice",
                        value: event.target.value,
                      })
                    }
                    placeholder="Optional"
                    className="h-[40px] rounded-[12px] border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary/15"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    Display Text
                  </p>

                  <Input
                    value={override?.displayText || ""}
                    onChange={(event) =>
                      onVariationChange({
                        variationId: String(variation.id),
                        key: "displayText",
                        value: event.target.value,
                      })
                    }
                    placeholder={variation.name}
                    className="h-[40px] rounded-[12px] border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary/15"
                  />
                </div>
              </div>

              {modifiers.length > 0 ? (
                <div className="mt-4 rounded-[14px] border border-gray-100 bg-white p-3">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900">
                      Modifier prices for {variation.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Prefilled from item-level modifier base prices.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {modifiers.map((modifier) => (
                      <div
                        key={`${variation.id}-${modifier.id}`}
                        className="grid w-full min-w-0 gap-3 rounded-[12px] border border-gray-100 bg-[#FAFAFA] p-3 sm:grid-cols-[minmax(0,1fr)_150px]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {modifier.name}
                          </p>

                          {hasPositiveAmount(modifier.priceDelta) ? (
                            <p className="mt-0.5 text-xs text-gray-500">
                              Master delta: ${formatAmount(modifier.priceDelta)}
                            </p>
                          ) : null}
                        </div>

                        <Input
                          type="number"
                          min={0}
                          value={getNestedModifierValue(
                            String(variation.id),
                            modifier
                          )}
                          onKeyDown={blockInvalidNumberKeys}
                          onPaste={blockNegativeNumberPaste}
                          onChange={(event) =>
                            onNestedModifierChange({
                              variationId: String(variation.id),
                              modifierId: String(modifier.id),
                              priceDelta: event.target.value,
                            })
                          }
                          placeholder="0"
                          className="h-[40px] min-w-0 rounded-[12px] border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary/15"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}