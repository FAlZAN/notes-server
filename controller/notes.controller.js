// third-party import
const { ObjectId } = require("mongodb");
// db
const { getDB } = require("../db/config.js");

const createNewNote = async (request, response) => {
  const db = await getDB();
  const { user_id, title, note } = request.body;

  try {
    const newNote = await db.collection("notes").insertOne({
      user_id: new ObjectId(user_id),
      title,
      note,
      createdAt: new Date().toLocaleString(),
    });

    response.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

const getNotes = async (request, response) => {
  const db = await getDB();
  const { id } = request.params;

  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid id provided." });
  }

  try {
    const notes = await db
      .collection("notes")
      .find({ user_id: new ObjectId(id) })
      .sort({ createdAt: -1 })
      .toArray();
    response.status(200).json(notes);
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

const deleteANote = async (request, response) => {
  const db = await getDB();
  const { id } = request.params;

  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid id provided." });
  }

  try {
    const deletedNote = await db
      .collection("notes")
      .deleteOne({ _id: new ObjectId(id) });

    response.status(200).json(deletedNote);
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

const updateANote = async (request, response) => {
  const db = await getDB();
  const { id } = request.params;
  const { title, note } = request.body;

  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid id provided." });
  }

  try {
    const updatedNote = await db.collection("notes").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title,
          note: note,
          lastUpdateAt: new Date().toLocaleString(),
        },
      }
    );

    response.status(200).json(updatedNote);
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

module.exports = {
  createNewNote,
  getNotes,
  deleteANote,
  updateANote,
};
