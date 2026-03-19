(() => {
        const DEFAULT_FORMAT = "DD/MM/YYYY";
        const DEFAULT_UNIT = "day";

        function renderCDates(root = document) {
          const nodes = root.querySelectorAll("[c-date], [c-date-now]");

          nodes.forEach((el) => {
            let offset = 0;

            if (el.hasAttribute("c-date-now")) {
              offset = 0;
            } else if (el.hasAttribute("c-date")) {
              const raw = el.getAttribute("c-date");
              offset = raw === null || raw.trim() === "" ? 0 : Number(raw);
              if (Number.isNaN(offset)) offset = 0;
            }

            const unit = (el.getAttribute("c-date-unit") || DEFAULT_UNIT).trim();
            const format = (el.getAttribute("c-date-format") || DEFAULT_FORMAT).trim();

            el.textContent = dayjs().add(offset, unit).format(format);
          });
        }

        renderCDates();

        // чтобы можно было дернуть руками после динамической вставки
        window.renderCDates = renderCDates;
      })();