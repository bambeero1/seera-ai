import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import Icon from "../Icon";
import Add from "./Add";
import Item from "./Item";
import styles from "./Sidebar.module.css";

const Sidebar = ({
  sections,
  currentSection,
  onSectionSelect,
  onSectionAdd,
}) => {
  const [showAdd, setShowAdd] = useState<string>();

  return (
    <div className={styles.sidebar}>
      <h2>
        <Icon size="lg">list_alt</Icon> Sections
      </h2>

      <ul className={styles.list}>
        {sections.map((section) => (
          <li key={section.id}>
            <Item
              {...section}
              onClick={() => onSectionSelect(section)}
              isSelected={currentSection.section?.id === section.id}
              onDelete={(event) => {
                event.preventDefault();

                const newSections = sections.filter(
                  (item) => item.id !== section.id
                );

                onSectionAdd(newSections);
              }}
            />

            <ul>
              {section.children?.length > 0 &&
                section.children.map((child) => (
                  <li key={child}>
                    <Item
                      {...child}
                      onClick={() => onSectionSelect(section, child)}
                      isSelected={currentSection.child?.id === child.id}
                      onDelete={(event) => {
                        event.preventDefault();

                        const newSections = sections.map((item) => {
                          if (item.id === section.id) {
                            return {
                              ...section,
                              children: item.children.filter(
                                (childSection) => childSection.id !== child.id
                              ),
                            };
                          }

                          return item;
                        });

                        onSectionAdd(newSections);
                      }}
                    />
                  </li>
                ))}

              <li className={styles.listItem}>
                {showAdd === section.id ? (
                  <Add
                    onSave={(value: string) => {
                      if (value === "") return;

                      const newSections = sections.map((item) => {
                        if (item.id === section.id) {
                          return {
                            ...item,
                            children: [
                              ...item.children,
                              {
                                id: value.toLowerCase().replace(" ", "-"),
                                title: value,
                                history: [],
                              },
                            ],
                          };
                        }

                        return item;
                      });

                      onSectionAdd(newSections);
                      setShowAdd(undefined);
                    }}
                  />
                ) : (
                  <div onClick={() => setShowAdd(section.id)}>
                    <Icon size="sm">add_circle</Icon> Add Sub-Section
                  </div>
                )}
              </li>
            </ul>
          </li>
        ))}

        <li className={styles.listItem}>
          {showAdd === "_" ? (
            <Add
              onSave={(value: string) => {
                if (value === "") return;

                onSectionAdd([
                  ...sections,
                  [
                    {
                      id: value.toLowerCase().replace(" ", "-"),
                      title: value,
                      history: [],
                    },
                  ],
                ]);

                setShowAdd(undefined);
              }}
            />
          ) : (
            <div onClick={() => setShowAdd("_")}>
              <Icon size="sm">add_circle</Icon> Add Section
            </div>
          )}
        </li>
      </ul>

      <div className={styles.spacer} />

      <div className={styles.menu}>
        <ul>
          <li>
            <Link href="/my-data">What happens to my data?</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/imprint">Imprint</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
