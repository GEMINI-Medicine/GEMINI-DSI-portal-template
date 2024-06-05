/** @jsxRuntime classic */
/** @jsx jsx */

import { Box, jsx } from "@keystone-ui/core";
import {
  component,
  fields,
  NotEditable,
} from "@keystone-6/fields-document/component-blocks";

export const accordian = component({
  label: "Accordian",
  preview: function Preview(props) {
    return (
      <NotEditable>
        <div
          css={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {props.fields.items.elements.map((item) => {
            return (
              <Box
                key={item.key}
                margin="xsmall"
                css={{
                  minWidth: "61.8%",
                  margin: 4,
                  padding: 8,
                  boxSizing: "border-box",
                  borderRadius: 6,
                  background: "#eff3f6",
                }}
              >
                <h1
                  css={{
                    "&&": {
                      fontSize: "1.25rem",
                      lineHeight: "unset",
                      marginTop: 8,
                    },
                  }}
                >
                  {item.fields.question.value}
                </h1>

                <div>{item.fields.answer.value}</div>
              </Box>
            );
          })}
        </div>
      </NotEditable>
    );
  },
  schema: {
    items: fields.array(
      fields.object({
        question: fields.text({ label: "Question" }),
        answer: fields.text({ label: "Answer" }),
      }),
    ),
  },
});
