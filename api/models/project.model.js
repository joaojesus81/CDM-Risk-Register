const connection = require("../../db/connection");

exports.fetchProjectByNumber = (project_number) => {
  return connection("projects")
    .where("project_number", project_number["project_number"])
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({ status: 400, msg: "Project not found" });
      } else {
        return response;
      }
    });
};

exports.deleteProjectByNumber = (project_number) => {
  return connection("projects")
    .where("project_number", project_number["project_number"])
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({ status: 400, msg: "Project not found" });
      } else {
        return connection("projects")
          .where("project_number", project_number["project_number"])
          .del();
      }
    });
};

exports.createProjectByNumber = ({
  project_number,
  project_title,
  project_lead_office,
  client,
  stage,
}) => {
  return connection("projects").insert(
    {
      project_number,
      project_title,
      project_lead_office,
      client,
      stage,
    },
    [
      "project_number",
      "project_title",
      "project_lead_office",
      "client",
      "stage",
    ]
  );
};

exports.editProjectByNumber = ({
  project_number,
  project_title,
  project_lead_office,
  client,
  stage,
}) => {
  if (project_number === undefined) {
    return Promise.reject({ status: 400, msg: "Project number missing." });
  } else {
    return connection("projects")
      .where("project_number", project_number)
      .update(
        {
          project_number,
          project_title,
          project_lead_office,
          client,
          stage,
        },
        [
          "project_number",
          "project_title",
          "project_lead_office",
          "client",
          "stage",
        ]
      )
      .then((response) => {
        if (response.length < 1) {
          return Promise.reject({
            status: 400,
            msg: "Project not found.",
          });
        } else {
          return response;
        }
      });
  }
};

exports.fetchRecordByProject = (project_number) => {
  return connection("record_issues")
    .where("project_number", project_number["project_number"])
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({ status: 400, msg: "Project not found" });
      } else {
        return response;
      }
    });
};

exports.fetchRecordByRecordId = (params) => {
  return connection("record_issues")
    .where({
      project_number: params.project_number,
      record_id: params.record_id,
    })
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({ status: 400, msg: "Project not found" });
      } else {
        return response;
      }
    });
};

exports.fetchOneRecordByProject = (params) => {
  return connection("record_issues")
    .where({
      project_number: params.project_number,
      version_number: params.version,
    })
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({ status: 400, msg: "Record not found" });
      } else {
        return response;
      }
    });
};

exports.deleteOneRecordFromProject = (params) => {
  return connection("record_issues")
    .where({
      project_number: params.project_number,
      version_number: params.version,
    })
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({ status: 400, msg: "Record not found" });
      } else {
        return connection("record_issues")
          .where({
            project_number: params.project_number,
            version_number: params.version,
          })
          .del()
          .returning("record_id");
      }
    });
};

exports.fetchAllRisks = (project_number) => {
  return connection("register")
    .select()
    .where("project_number", project_number)
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({
          status: 400,
          msg: "Project number doesn't exist",
        });
      } else {
        return response;
      }
    });
};

exports.fetchRiskByNumber = ({ project_number, discipline, stage, number }) => {
  return connection("register")
    .select()
    .where({ project_number })
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({
          status: 400,
          msg: "Project number is incorrect.",
        });
      } else {
        return undefined;
      }
    })
    .then(() => {
      return connection("register")
        .select()
        .where({ project_number, discipline, project_lifecycle_stage: stage })
        .then((response) => {
          if (response.length < Number(number)) {
            return Promise.reject({ status: 400, msg: "Risk does not exist." });
          } else {
            return response[Number(number) - 1];
          }
        });
    });
};

exports.editRiskByNumber = (
  body,
  { project_number, discipline, stage, number }
) => {
  return connection("register")
    .select()
    .where({ project_number })
    .then((response) => {
      if (response.length < 1) {
        return Promise.reject({
          status: 400,
          msg: "Project number is incorrect.",
        });
      }
    })
    .then(() => {
      return connection("register")
        .select()
        .where({ project_number, discipline, project_lifecycle_stage: stage })
        .then((response) => {
          if (response.length < Number(number)) {
            return Promise.reject({
              status: 400,
              msg: "Risk does not exist.",
            });
          } else {
            for (let i = 0; i < response.length; i++) {
              if (i === Number(number) - 1) {
                return connection("register")
                  .where("register_id", response[i].register_id)
                  .update(body, ["*"]);
              }
            }
          }
        });
    });
};
