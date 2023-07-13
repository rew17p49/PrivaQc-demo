function fill_table(ref) {
  tableMaster = $("#tableMaster").DataTable({
    bDestroy: true,

    dom: "rtip",
    paging: false,
    scrollY: "200px",
    scrollCollapse: true,
    // "bInfo": false,
    // bLengthChange: false,t
    ajax: {
      url: `/masterdata/${ref}`,
      dataSrc: "",
    },
    // order: [[0, "desc"]],
    columns: [
      {
        // width: "25%",
        data: "valueDatetime",
        render: function (data, type, row) {
          console.log();
          data = data.split("T");
          data = `${data[0]} ${data[1].replace(".000Z", "")}`;
          return data;
        },
      },
      {
        // width: "10%",
        data: "valueData",
      },
    ],
  });
}
