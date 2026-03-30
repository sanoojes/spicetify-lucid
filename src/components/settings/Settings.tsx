import type { Component, GroupProps, SectionProps } from "@/types/settingSchema.ts";
import getSettingsSections from "@/components/settings/helper/getSettingsSections.ts";
import Section from "@/components/settings/ui/Section.tsx";
import UI from "@/components/ui";
import appStore from "@/store/appStore.ts";
import setFloating from "@/utils/dom/setFloating.ts";
import React, { useEffect, useState } from "react";
import { useStore } from "zustand";

const Settings: React.FC = () => {
  const [sections, setSections] = useState<SectionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const isFloating = useStore(appStore, (state) => state.settingModal.isFloating);

  useEffect(() => {
    document.body.classList.add("settings-open");

    const initialSections = getSettingsSections();
    setSections(initialSections);
    setLoading(false);

    const unsubscribe = appStore.subscribe((state) => {
      const updatedSections = getSettingsSections(state);
      setSections(updatedSections);
    });
    return () => {
      document.body.classList.remove("settings-open");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isFloating) return;
    const target = document.querySelector(".GenericModal") as HTMLElement | null;
    const dragTarget = document.querySelector(
      ".main-trackCreditsModal-header",
    ) as HTMLElement | null;
    if (!target || !dragTarget) return;

    const cleanup = setFloating({
      target,
      dragTarget,
      defaultPosition: appStore.getState().settingModal.floatingPosition,
      addClassTarget: document.querySelectorAll(
        ".GenericModal__overlay,.GenericModal,.main-embedWidgetGenerator-container",
      ),
      onDragEnd: (x, y) => appStore.getState().setSettingModalPosition(x, y),
    });

    return () => cleanup();
  }, [isFloating]);

  const lowerSearch = searchQuery.toLowerCase();

  const filteredSections = sections
    .filter((section) => section.sectionName === selectedCategory || selectedCategory === "All")
    .map((section) => {
      const filteredGroups = section.groups
        .map((group) => {
          const filteredComponents = group.components.filter((comp: Component) =>
            comp.label.toLowerCase().includes(lowerSearch),
          );
          if (filteredComponents.length === 0) return null;
          return { ...group, components: filteredComponents };
        })
        .filter(Boolean) as GroupProps[];

      if (filteredGroups.length === 0) return null;
      return { ...section, groups: filteredGroups };
    })
    .filter(Boolean) as SectionProps[];

  const categories = ["All", ...sections.map((s) => s.sectionName)];

  return (
    <div className="lucid-settings">
      <div className="search-wrapper">
        <div className="section-card encore-text encore-text-body-small encore-internal-color-text-base">
          <UI.Carousel
            categories={categories}
            defaultIndex={0}
            onCategorySelect={(label) => setSelectedCategory(label)}
          />
          <UI.Input
            inputType="text"
            onChange={setSearchQuery}
            value={searchQuery}
            placeholder="Search settings..."
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <UI.Loader />
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="section-card encore-text encore-text-body-small encore-internal-color-text-base">
          <p className="encore-text lucid-error-text">No settings found.</p>
        </div>
      ) : (
        filteredSections.map((section) => <Section key={section.id} {...section} />)
      )}
    </div>
  );
};

export default Settings;
