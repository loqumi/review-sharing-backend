import Tags from "../models/TagsModel.js";

const getTagByTitle = async (data) => {
  return await Tags.findOne({
    where: {
      title: data,
    },
  });
};

const createNewTagTitle = async (data) => {
  const getTitle = await getTagByTitle(data);
  if (!getTitle) {
    try {
      await Tags.create({
        title: data.toLowerCase(),
      });
    } catch (error) {}
  }
};

export const postTags = async (req, res) => {
  const { tag } = req.body;
  Promise.all(tag.map(createNewTagTitle))
    .then(() => res.status(200).json({ msg: "All complete" }))
    .catch((error) => res.status(500).json({ msg: error.message }));
};

export const getTags = async (req, res) => {
  try {
    const response = await Tags.findAll({
      attributes: ["title"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
