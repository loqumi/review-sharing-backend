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
      res.status(201).json({ msg: "successful add tag" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
};

export const postTags = async (req, res) => {
  const { tag } = req.body;
  Promise.all(tag.map(createNewTagTitle))
    .then(() => res.status(200).json({ msg: "all complete" }))
    .catch((error) => res.status(500).json({ msg: error.message }));
};

export const getTags = async (req, res) => {
  try {
    const response = await Tags.findAll({
      attributes: ["title"],
    });
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
